'use server'

import { BuildFilters } from '@/app/(components)/filters/build-filters'
import { DEFAULT_ITEMS_PER_PAGE } from '@/features/pagination/constants'

import { CommunityBuilds } from './community-builds'

export default async function Page() {
  return (
    <>
      <div className="mb-6 flex w-full items-center justify-center">
        <BuildFilters key="community-build-filters" />
      </div>

      <div className="grid w-full grid-cols-1 gap-2">
        <CommunityBuilds itemsPerPage={DEFAULT_ITEMS_PER_PAGE} />
      </div>
    </>
  )
}
