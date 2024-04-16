'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BuildVisibilityFilter } from '@/app/(components)/form-fields/filters/build-visibility-filter'
import { useBuildVisibilityFilter } from '@/app/(components)/form-fields/filters/build-visibility-filter/use-build-visibility-filter'
import { OrderByFilter } from '@/app/(components)/form-fields/filters/order-by-filter'
import { useOrderByFilter } from '@/app/(components)/form-fields/filters/order-by-filter/use-order-by-filter'
import { TimeRangeFilter } from '@/app/(components)/form-fields/filters/time-range-filter'
import { useTimeRangeFilter } from '@/app/(components)/form-fields/filters/time-range-filter/use-time-range-filter'
import { CreatedBuildCardActions } from '@/app/profile/[userId]/(components)/CreatedBuildCardActions'
import { getCreatedBuilds } from '@/app/profile/[userId]/created-builds/getCreatedBuilds'
import { BuildCard } from '@/features/build/components/build-card/BuildCard'
import { CreateBuildCard } from '@/features/build/components/build-card/CreateBuildCard'
import { BuildList } from '@/features/build/components/BuildList'
import { parseBuildListFilters } from '@/features/build/filters/lib/parseBuildListFilters'
import { useBuildListState } from '@/features/build/hooks/useBuildListState'
import { usePagination } from '@/features/pagination/usePagination'
import { SelectMenu } from '@/features/ui/SelectMenu'

interface Props {
  isEditable: boolean
  userId: string
}

export function CreatedBuilds({ isEditable, userId }: Props) {
  const searchParams = useSearchParams()
  const [buildListFilters, setBuildListFilters] = useState(
    parseBuildListFilters(searchParams),
  )
  useEffect(() => {
    setBuildListFilters(parseBuildListFilters(searchParams))
  }, [searchParams])

  const { buildListState, setBuildListState } = useBuildListState()
  const { builds, totalBuildCount, isLoading } = buildListState

  const itemsPerPage = isEditable ? 15 : 16

  const { orderBy, handleOrderByChange } = useOrderByFilter('newest')
  const { timeRange, handleTimeRangeChange } = useTimeRangeFilter('all-time')
  const { buildVisibility, handleBuildVisibilityChange } =
    useBuildVisibilityFilter('all')

  const {
    currentPage,
    firstVisibleItemNumber,
    lastVisibleItemNumber,
    pageNumbers,
    totalPages,
    handleSpecificPageClick,
    handleNextPageClick,
    handlePreviousPageClick,
  } = usePagination({
    totalItemCount: totalBuildCount,
    itemsPerPage,
  })

  useEffect(() => {
    const getItemsAsync = async () => {
      setBuildListState((prevState) => ({ ...prevState, isLoading: true }))
      const response = await getCreatedBuilds({
        buildListFilters,
        featuredBuildsOnly: false,
        itemsPerPage,
        orderBy,
        pageNumber: currentPage,
        timeRange,
        userId,
        isEditable,
        buildVisibility,
      })
      setBuildListState((prevState) => ({
        ...prevState,
        isLoading: false,
        builds: response.items,
        totalBuildCount: response.totalItemCount,
      }))
    }
    getItemsAsync()
  }, [
    buildListFilters,
    buildVisibility,
    currentPage,
    isEditable,
    itemsPerPage,
    orderBy,
    setBuildListState,
    timeRange,
    userId,
  ])

  return (
    <>
      <BuildList
        currentPage={currentPage}
        isLoading={isLoading}
        label="Created Builds"
        pageNumbers={pageNumbers}
        totalItems={totalBuildCount}
        totalPages={totalPages}
        firstVisibleItemNumber={firstVisibleItemNumber}
        lastVisibleItemNumber={lastVisibleItemNumber}
        onPreviousPage={handlePreviousPageClick}
        onNextPage={handleNextPageClick}
        onSpecificPage={handleSpecificPageClick}
        headerActions={
          <div className="flex w-full flex-col items-end justify-end gap-x-2 gap-y-1 sm:flex-row sm:gap-y-0">
            <div className="w-full max-w-[250px]">
              <TimeRangeFilter
                value={timeRange}
                onChange={handleTimeRangeChange}
              />
            </div>
            <div className="w-full max-w-[250px]">
              <OrderByFilter value={orderBy} onChange={handleOrderByChange} />
            </div>
            {isEditable ? (
              <div className="w-full max-w-[250px]">
                <BuildVisibilityFilter
                  value={buildVisibility}
                  onChange={handleBuildVisibilityChange}
                />
              </div>
            ) : null}
          </div>
        }
      >
        <ul
          role="list"
          className="mb-4 mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {isEditable ? <CreateBuildCard /> : null}

          {builds.map((build) => (
            <div key={build.id} className="h-full w-full">
              <BuildCard
                build={build}
                isLoading={isLoading}
                showBuildVisibility={true}
                footerActions={
                  isEditable ? (
                    <CreatedBuildCardActions
                      build={build}
                      onDelete={(buildId: string) => {
                        setBuildListState((prevState) => ({
                          ...prevState,
                          builds: prevState.builds.filter(
                            (b) => b.id !== buildId,
                          ),
                          totalBuildCount: prevState.totalBuildCount - 1,
                        }))
                      }}
                    />
                  ) : undefined
                }
              />
            </div>
          ))}
        </ul>
      </BuildList>
    </>
  )
}
