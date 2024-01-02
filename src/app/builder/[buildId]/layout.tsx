import BuildPage from './page'
import { Metadata, ResolvingMetadata } from 'next'
import { getServerSession } from '@/app/(lib)/auth'
import { ExtendedBuild } from '@/app/(types)'
import { prisma } from '@/app/(lib)/db'
import { DEFAULT_DISPLAY_NAME } from '@/app/(data)/constants'

async function getBuild(buildId: string) {
  if (!buildId) {
    console.error('No buildId provided!')
    return Response.json({ message: 'No buildId provided!' }, { status: 500 })
  }

  const session = await getServerSession()

  const build = await prisma?.build.findUnique({
    where: {
      id: buildId,
    },
    include: {
      createdBy: true,
      BuildVotes: true,
    },
  })

  if (!build) {
    return Response.json({ message: 'Build not found!' }, { status: 404 })
  }

  const returnedBuild: ExtendedBuild = {
    id: build.id,
    name: build.name,
    description: build.description ?? '',
    isPublic: build.isPublic,
    createdAt: build.createdAt,
    createdById: build.createdById,
    videoUrl: build.videoUrl ?? '',
    helm: build.helm,
    torso: build.torso,
    gloves: build.gloves,
    legs: build.legs,
    amulet: build.amulet,
    ring: build.ring,
    relic: build.relic,
    relicfragment: build.relicfragment,
    archtype: build.archtype,
    skill: build.skill,
    weapon: build.weapon,
    mod: build.mod,
    mutator: build.mutator,
    updatedAt: build.updatedAt,
    concoction: build.concoction,
    consumable: build.consumable,
    trait: build.trait,
    createdByDisplayName:
      build.createdBy.displayName ||
      build.createdBy.name ||
      DEFAULT_DISPLAY_NAME,
    upvoted: false,
    totalUpvotes: build.BuildVotes.length,
    reported: false,
    isMember: false,
  }

  const voteResult = await prisma?.buildVoteCounts.findFirst({
    where: {
      buildId,
      userId: session?.user?.id,
    },
  })
  returnedBuild.upvoted = Boolean(voteResult)

  const buildReported = await prisma?.buildReports.findFirst({
    where: {
      buildId,
      userId: session?.user?.id,
    },
  })
  returnedBuild.reported = Boolean(buildReported)

  const isPaidUser = await prisma.paidUsers.findFirst({
    where: {
      userId: session?.user?.id,
    },
  })
  returnedBuild.isMember = Boolean(isPaidUser)

  if (returnedBuild.isPublic) {
    return Response.json({ build: returnedBuild }, { status: 200 })
  }

  if (!session || !session.user || build.createdBy.id !== session.user.id) {
    console.error(
      'You must be logged in as the build creator to view a private build.',
    )
    return Response.json(
      {
        message:
          'You must be logged in as the build creator to view a private build.',
      },
      { status: 401 },
    )
  }

  return Response.json(
    { message: 'Successfully fetched build!', build: returnedBuild },
    { status: 200 },
  )
}

export async function generateMetadata(
  { params: { buildId } }: { params: { buildId: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const buildData = await getBuild(buildId)
  const { build } = await buildData.json()

  if (!build.isPublic) {
    return {
      title: 'Private Build',
      description: 'This build is private.',
      openGraph: {
        title: 'Private Build',
        description: 'This build is private.',
        url: `https://remnant2builder.com/builder/${build.id}`,
        images: [`https://${process.env.NEXT_PUBLIC_IMAGE_URL}/og_image.png`],
      },
      twitter: {
        title: 'Private Build',
        description: 'This build is private.',
        images: [`https://${process.env.NEXT_PUBLIC_IMAGE_URL}/og_image.png`],
      },
    }
  }

  const previousOGImages = (await parent).openGraph?.images || []
  const previousTwitterImages = (await parent).twitter?.images || []
  const title = `${build.name} by ${build.createdByDisplayName}`
  const description =
    build.description ??
    'A build for Remnant 2, generated by remnant2toolkit.com'

  return {
    title,
    description,
    openGraph: {
      title,
      description: description,
      url: `https://remnant2builder.com/builder/${build.id}`,
      images: [
        `https://${process.env.NEXT_PUBLIC_IMAGE_URL}/og_image.png`,
        ...previousOGImages,
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `https://${process.env.NEXT_PUBLIC_IMAGE_URL}/og_image.png`,
        ...previousTwitterImages,
      ],
    },
  }
}

export default async function Layout({
  params: { buildId },
}: {
  params: { buildId: string }
}) {
  const buildData = await getBuild(buildId)
  const { build: extendedBuild } = await buildData.json()

  if (buildData.status !== 200) {
    throw new Error(`Build ${buildId} is not found. If you are sure the build exists, it may
    be marked private. You must be logged in as the build creator to view
    a private build.`)
  }

  return <BuildPage params={{ extendedBuild }} />
}
