import { Prisma } from '@prisma/client'

export function limitByReferenceLink(limitByReferenceLink: boolean) {
  return limitByReferenceLink
    ? Prisma.sql`AND Build.buildLink IS NOT NULL AND Build.buildLink != ''`
    : Prisma.empty
}
