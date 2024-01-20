'use client'

import { useEffect, useState } from 'react'
import { FeaturedBuildsFilter, getFeaturedBuilds } from '../actions'
import BuildCard from '../../(components)/BuildCard'
import BuildList from '@/app/(components)/BuildList'
import usePagination from '@/app/(hooks)/usePagination'
import Link from 'next/link'
import BuildListFilters from '@/app/(components)/BuildListFilters'
import { DBBuild } from '@/app/(types)/build'
import { isErrorResponse } from '@/app/(types)'
import { toast } from 'react-toastify'
import { dbBuildToBuildState } from '@/app/(lib)/build'
import useBuildActions from '@/app/builder/(hooks)/useBuildActions'
import { FilterProps } from './Filters'

interface Props {
  itemsPerPage?: number
  globalFilters: FilterProps
}

export default function FeaturedBuilds({
  itemsPerPage = 8,
  globalFilters,
}: Props) {
  const [builds, setBuilds] = useState<DBBuild[]>([])
  const [totalBuildCount, setTotalBuildCount] = useState<number>(0)
  const [filter, setFilter] = useState<FeaturedBuildsFilter>('date created')
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  const { handleReportBuild } = useBuildActions()

  // Fetch data
  useEffect(() => {
    const getItemsAsync = async () => {
      setIsLoading(true)
      const response = await getFeaturedBuilds({
        itemsPerPage,
        pageNumber: currentPage,
        filter,
        globalFilters,
      })
      setBuilds(response.items)
      setTotalBuildCount(response.totalItemCount)
      setIsLoading(false)
    }
    getItemsAsync()
  }, [currentPage, itemsPerPage, filter, globalFilters])

  function handleFilterChange(filter: string) {
    setFilter(filter as FeaturedBuildsFilter)
  }

  async function onReportBuild(buildId: string) {
    const reportedBuild = builds.find((build) => build.id === buildId)

    if (!reportedBuild) {
      console.error(`Could not find build with id ${buildId}, report not saved`)
      return
    }
    const newReported = !reportedBuild.reported
    const response = await handleReportBuild(
      dbBuildToBuildState(reportedBuild),
      newReported,
    )

    if (!response || isErrorResponse(response)) {
      console.error(response?.errors)
      toast.error(response?.errors?.[0])
    } else {
      toast.success(response.message)
      const newBuilds = builds.map((build) => {
        if (build.id === buildId) {
          build.reported = newReported
        }
        return build
      })
      setBuilds(newBuilds)
    }
  }

  const filterOptions: FeaturedBuildsFilter[] = ['date created', 'upvotes']

  if (totalBuildCount === 0) {
    return null
  }

  return (
    <>
      <BuildList
        label="Creator Spotlight"
        currentPage={currentPage}
        pageNumbers={pageNumbers}
        totalItems={totalBuildCount}
        totalPages={totalPages}
        isLoading={isLoading}
        firstVisibleItemNumber={firstVisibleItemNumber}
        lastVisibleItemNumber={lastVisibleItemNumber}
        onPreviousPage={handlePreviousPageClick}
        onNextPage={handleNextPageClick}
        onSpecificPage={handleSpecificPageClick}
        headerActions={
          <BuildListFilters
            filter={filter}
            onFilterChange={handleFilterChange}
            options={filterOptions}
          />
        }
      >
        {builds.map((build) => (
          <div key={build.id} className="h-full w-full">
            <BuildCard
              build={build}
              onReportBuild={onReportBuild}
              footerActions={
                <div className="flex items-center justify-end gap-2 p-2 text-sm">
                  <Link
                    href={`/builder/${build.id}`}
                    className="relative inline-flex items-center justify-center gap-x-3 rounded-br-lg border border-transparent p-4 text-sm font-semibold text-green-500 hover:text-green-700 hover:underline"
                  >
                    View Build
                  </Link>
                </div>
              }
            />
          </div>
        ))}
      </BuildList>
    </>
  )
}
