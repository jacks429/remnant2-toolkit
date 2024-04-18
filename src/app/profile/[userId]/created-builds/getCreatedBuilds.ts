'use server'

import { Prisma } from '@prisma/client'

import { BuildListFilters } from '@/app/(components)/filters/build-filters/types'
import { BuildVisibility } from '@/app/(components)/form-fields/selects/build-visibility-filter/use-build-visibility-filter'
import { OrderBy } from '@/app/(components)/form-fields/selects/order-by-filter/use-order-by-filter'
import { TimeRange } from '@/app/(components)/form-fields/selects/time-range-filter/use-time-range-filter'
import { getOrderBySegment } from '@/app/(queries)/build-filters/getOrderBySegment'
import {
  amuletFilterToId,
  limitByAmuletSegment,
} from '@/app/(queries)/build-filters/limitByAmulet'
import {
  archetypeFiltersToIds,
  limitByArchetypesSegment,
} from '@/app/(queries)/build-filters/limitByArchtypes'
import {
  buildTagsFilterToValues,
  limitByBuildTagsSegment,
} from '@/app/(queries)/build-filters/limitByBuildTags'
import { limitByFeatured } from '@/app/(queries)/build-filters/limitByFeatured'
import { limitByPatchAffected } from '@/app/(queries)/build-filters/limitByPatchAffected'
import { limitByReleasesSegment } from '@/app/(queries)/build-filters/limitByRelease'
import {
  limitByRingsSegment,
  ringsFilterToIds,
} from '@/app/(queries)/build-filters/limitByRings'
import { limitByTimeConditionSegment } from '@/app/(queries)/build-filters/limitByTimeCondition'
import {
  limitByWeaponsSegment,
  weaponFiltersToIds,
} from '@/app/(queries)/build-filters/limitByWeapons'
import { limitToBuildsWithReferenceLink } from '@/app/(queries)/build-filters/limitToBuildsWithReferenceLink'
import { limitToBuildsWithVideo } from '@/app/(queries)/build-filters/limitToBuildsWithVideo'
import {
  communityBuildsCountQuery,
  communityBuildsQuery,
} from '@/app/(queries)/build-filters/community-builds'
import { DBBuild } from '@/features/build/types'
import { prisma } from '@/features/db'
import { PaginationResponse } from '@/features/pagination/usePagination'
import { bigIntFix } from '@/lib/bigIntFix'

export type CreatedBuildsFilter = 'date created' | 'upvotes'

export async function getCreatedBuilds({
  buildListFilters,
  buildVisibility = 'public',
  featuredBuildsOnly,
  isEditable,
  itemsPerPage,
  orderBy,
  pageNumber,
  timeRange,
  userId,
}: {
  buildListFilters: BuildListFilters
  buildVisibility?: BuildVisibility
  featuredBuildsOnly: boolean
  isEditable: boolean
  itemsPerPage: number
  orderBy: OrderBy
  pageNumber: number
  timeRange: TimeRange
  userId: string
}): Promise<PaginationResponse<DBBuild>> {
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
  const weaponIds = weaponFiltersToIds({
    longGun,
    handGun,
    melee,
  })
  const tagValues = buildTagsFilterToValues(buildTags)
  const amuletId = amuletFilterToId({ amulet })
  const ringIds = ringsFilterToIds({ rings: [ring1, ring2, ring3, ring4] })

  let isPublicSegment: Prisma.Sql = Prisma.empty

  // If the user is not the owner of the profile, only show public builds
  // If the user is the owner of the profile, show all builds based on buildVisibility filter
  if (!isEditable) {
    isPublicSegment = Prisma.sql`AND Build.isPublic = true`
  } else {
    if (buildVisibility === 'public') {
      isPublicSegment = Prisma.sql`AND Build.isPublic = true`
    } else if (buildVisibility === 'private') {
      isPublicSegment = Prisma.sql`AND Build.isPublic = false`
    } else {
      isPublicSegment = Prisma.empty
    }
  }

  const whereConditions = Prisma.sql`
  WHERE Build.createdById = ${userId}
  ${isPublicSegment}
  ${limitByPatchAffected(includePatchAffectedBuilds)}
  ${limitToBuildsWithReferenceLink(onlyBuildsWithReferenceLink)}
  ${limitToBuildsWithVideo(onlyBuildsWithVideo)}
  ${limitByArchetypesSegment(archetypeIds)}
  ${limitByWeaponsSegment(weaponIds)}
  ${limitByAmuletSegment(amuletId)}
  ${limitByRingsSegment(ringIds)}
  ${limitByFeatured(featuredBuildsOnly)}
  ${limitByReleasesSegment(selectedReleases)}
  ${limitByTimeConditionSegment(timeRange)}
  ${limitByBuildTagsSegment(tagValues)}
  `

  const orderBySegment = getOrderBySegment(orderBy)

  const trimmedSearchText = searchText.trim()

  // First, get the Builds
  const [builds, totalBuildsCountResponse] = await prisma.$transaction([
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

  // Then, for each Build, get the associated BuildItems
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

  const totalBuildCount = totalBuildsCountResponse[0].totalBuildCount

  return bigIntFix({
    items: builds,
    totalItemCount: totalBuildCount,
  })
}
