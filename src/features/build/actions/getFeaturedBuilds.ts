'use server'

import { Prisma } from '@prisma/client'

import { OrderBy } from '@/app/(components)/form-fields/selects/order-by-filter/use-order-by-filter'
import { TimeRange } from '@/app/(components)/form-fields/selects/time-range-filter/use-time-range-filter'
import { limitToBuildsWithReferenceLink } from '@/app/(queries)/build-filters/limitToBuildsWithReferenceLink'
import { limitToBuildsWithVideo } from '@/app/(queries)/build-filters/limitToBuildsWithVideo'
import { BuildListFilters } from '@/app/(types)/build-list-filters'
import { getServerSession } from '@/features/auth/lib'
import { prisma } from '@/features/db'
import { PaginationResponse } from '@/features/pagination/usePagination'
import { bigIntFix } from '@/lib/bigIntFix'

import {
  communityBuildsCountQuery,
  communityBuildsQuery,
} from '../../../app/(queries)/build-filters/community-builds'
import { getOrderBySegment } from '../../../app/(queries)/build-filters/segments/get-order-by'
import { limitByTimeConditionSegment } from '../../../app/(queries)/build-filters/segments/limit-by-time-condition'
import {
  amuletFilterToId,
  limitByAmuletSegment,
} from '../../../app/(queries)/build-filters/segments/limit-by-amulet'
import {
  archetypeFiltersToIds,
  limitByArchetypesSegment,
} from '../../../app/(queries)/build-filters/segments/limit-by-archetypes'
import {
  buildTagsFilterToValues,
  limitByBuildTagsSegment,
} from '../../../app/(queries)/build-filters/segments/limit-by-build-tags'
import { limitByPatchAffected } from '../../../app/(queries)/build-filters/segments/limit-by-patch-affected'
import { limitByReleasesSegment } from '../../../app/(queries)/build-filters/segments/limit-by-release'
import {
  limitByRingsSegment,
  ringsFilterToIds,
} from '../../../app/(queries)/build-filters/segments/limit-by-rings'
import {
  limitByWeaponsSegment,
  weaponFiltersToIds,
} from '../../../app/(queries)/build-filters/segments/limit-by-weapons'
import { DBBuild } from '../types'

export async function getFeaturedBuilds({
  buildListFilters,
  itemsPerPage,
  orderBy,
  pageNumber,
  timeRange,
}: {
  buildListFilters: BuildListFilters
  itemsPerPage: number
  orderBy: OrderBy
  pageNumber: number
  timeRange: TimeRange
}): Promise<PaginationResponse<DBBuild>> {
  const session = await getServerSession()
  const userId = session?.user?.id

  const {
    amulet,
    archetypes,
    buildTags,
    handGun,
    longGun,
    melee,
    ring1,
    ring2,
    ring3,
    ring4,
    searchText,
    selectedReleases,
    includePatchAffectedBuilds,
    limitToBuildsWithReferenceLink: onlyBuildsWithReferenceLink,
    limitToBuildsWithVideo: onlyBuildsWithVideo,
  } = buildListFilters

  if (selectedReleases.length === 0) return { items: [], totalItemCount: 0 }

  const archetypeIds = archetypeFiltersToIds({ archetypes })
  const weaponIds = weaponFiltersToIds({ longGun, handGun, melee })
  const amuletId = amuletFilterToId({ amulet })
  const tagValues = buildTagsFilterToValues(buildTags)
  const ringIds = ringsFilterToIds({ rings: [ring1, ring2, ring3, ring4] })

  const whereConditions = Prisma.sql`
  WHERE Build.isPublic = true
  AND Build.isFeaturedBuild = true
  ${limitByPatchAffected(includePatchAffectedBuilds)}
  ${limitToBuildsWithReferenceLink(onlyBuildsWithReferenceLink)}
  ${limitToBuildsWithVideo(onlyBuildsWithVideo)}
  ${limitByArchetypesSegment(archetypeIds)}
  ${limitByWeaponsSegment(weaponIds)}
  ${limitByReleasesSegment(selectedReleases)}
  ${limitByTimeConditionSegment(timeRange)}
  ${limitByAmuletSegment(amuletId)}
  ${limitByRingsSegment(ringIds)}
  ${limitByBuildTagsSegment(tagValues)}
  `

  const orderBySegment = getOrderBySegment(orderBy, true)

  const trimmedSearchText = searchText.trim()

  const [builds, totalBuildCountResponse] = await prisma.$transaction([
    communityBuildsQuery({
      userId,
      itemsPerPage,
      pageNumber,
      orderBySegment,
      whereConditions,
      searchText: trimmedSearchText,
    }),
    communityBuildsCountQuery({
      whereConditions,
      searchText: trimmedSearchText,
    }),
  ])

  if (!builds) return { items: [], totalItemCount: 0 }

  const totalBuilds = totalBuildCountResponse[0].totalBuildCount

  // Find all build items for each build
  for (const build of builds) {
    const buildItems = await prisma.buildItems.findMany({
      where: { buildId: build.id },
    })
    build.buildItems = buildItems
  }

  // Then, for each Build, get the associated BuildTags
  for (const build of builds) {
    const buildTags = await prisma.buildTags.findMany({
      where: { buildId: build.id },
    })
    build.buildTags = buildTags
  }

  return bigIntFix({ items: builds, totalItemCount: totalBuilds })
}
