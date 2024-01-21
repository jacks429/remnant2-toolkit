import type { NextRequest } from 'next/server'
import { patreon as patreonAPI } from 'patreon'
import { prisma } from '@/app/(lib)/db'

const toolkitUserId = 'clql3zq8k0000a6m41vtnvldq'

/**
 * Gives specific users the benefits of a paid user
 */
const allowListUserIds: string[] = []

/**
 * CRON script that runs to moderate reported users and builds
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  try {
    const patreonAPIClient = patreonAPI(
      process.env.PATREON_CREATOR_ACCESS_TOKEN,
    )

    const campaign = await patreonAPIClient('/current_user/campaigns').then(
      ({ store }: { store: any }) => {
        const campaigns = store
          .findAll('campaign')
          .map((campaign: any) => campaign.serialize())

        return campaigns[0]
      },
    )
    const campaignId = campaign.data.id

    const pledgeEmails = await patreonAPIClient(
      `/campaigns/${campaignId}/pledges`,
    ).then(({ store }: { store: any }) =>
      store.findAll('pledge').map((pledge: any) => pledge.patron.email),
    )

    // Need to remove all users from the db table PaidUsers whose User.email is not in pledgeEmails
    const paidUsers = await prisma.paidUsers.findMany({
      include: {
        user: true, // Include the related User record
      },
    })
    for (const paidUser of paidUsers) {
      if (!pledgeEmails.includes(paidUser.user.email)) {
        await prisma.paidUsers.delete({
          where: {
            id: paidUser.id,
          },
        })
      }
    }

    // Need to add all users from pledgeEmails whose User.email is not in PaidUsers
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: pledgeEmails,
        },
      },
    })
    for (const user of users) {
      const paidUser = await prisma.paidUsers.findFirst({
        where: {
          userId: user.id,
        },
      })
      // if user is already in PaidUsers, skip
      if (paidUser) continue
      // if user is not in PaidUsers, add
      await prisma.paidUsers.create({
        data: {
          userId: user.id,
        },
      })
    }

    // Add the allowed users to the PaidUsers table
    for (const userId of allowListUserIds) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!user) continue
      const paidUser = await prisma.paidUsers.findFirst({
        where: {
          userId: user.id,
        },
      })
      // if user is already in PaidUsers, skip
      if (paidUser) continue
      // if user is not in PaidUsers, add
      await prisma.paidUsers.create({
        data: {
          userId: user.id,
        },
      })
    }

    // Add a build vote for each user in PaidUsers from the toolkit account
    const toolkitUser = await prisma.user.findUnique({
      where: {
        id: toolkitUserId,
      },
    })
    if (!toolkitUser) {
      throw new Error('Toolkit user not found')
    }

    // Find every build for each PaidUser,
    // then add a row to BuildVoteCounts for each build for
    // the toolkitUserId
    const paidUsersWithUser = await prisma.paidUsers.findMany()
    for (const paidUser of paidUsersWithUser) {
      const builds = await prisma.build.findMany({
        where: {
          createdById: paidUser.userId,
        },
      })
      for (const build of builds) {
        const buildVoteCount = await prisma.buildVoteCounts.findFirst({
          where: {
            buildId: build.id,
            userId: toolkitUserId,
          },
        })
        if (buildVoteCount) continue
        await prisma.buildVoteCounts.create({
          data: {
            buildId: build.id,
            userId: toolkitUserId,
          },
        })
      }
    }

    // Trigger webhook
    const params = {
      embeds: [
        {
          title: `Patreon Membership Script Succeeded`,
          color: 0x00ff00,
          fields: [
            {
              name: 'Last Run',
              value: new Date().toLocaleString('en-US', {
                timeZone: 'America/New_York',
              }),
            },
          ],
        },
      ],
    }

    const res = await fetch(`${process.env.WEBHOOK_CRON_LOGS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!res.ok) {
      console.error('Error in sending build webhook to Discord!')
    }

    console.info('Patreon membership script succeeded')

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ success: false })
  }
}