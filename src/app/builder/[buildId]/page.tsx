'use client'

import Builder from '@/app/builder/(components)/Builder'
import useBuildActions from '../(hooks)/useBuildActions'
import { ActionButton } from '../(components)/ActionButton'
import ToCsvButton from '@/app/(components)/ToCsvButton'
import { useIsClient } from 'usehooks-ts'
import { useRef } from 'react'
import { useSession } from 'next-auth/react'
import PageHeader from '@/app/(components)/PageHeader'
import { isErrorResponse } from '@/app/(types)'
import TotalUpvotes from '../(components)/TotalUpvotes'
import MasonryItemList from '../../(components)/MasonryItemList'
import ImageDownloadLink from '../(components)/ImageDownloadLink'
import { addVoteForBuild, removeVoteForBuild } from '../actions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { ExtendedBuild } from '../types'
import {
  buildStateToCsvData,
  buildStateToMasonryItems,
  extendedBuildToBuildState,
} from '../utils'

export default function Page({
  params: { build },
}: {
  params: { build: ExtendedBuild }
}) {
  const router = useRouter()
  const isClient = useIsClient()
  const { data: session } = useSession()

  const {
    isScreenshotMode,
    showControls,
    imageLink,
    imageExportLoading,
    handleClearImageLink,
    handleCopyBuildUrl,
    handleDuplicateBuild,
    handleImageExport,
    handleScrollToDetailedView,
    handleReportBuild,
  } = useBuildActions()

  const buildContainerRef = useRef<HTMLDivElement>(null)
  const detailedViewContainerRef = useRef<HTMLDivElement>(null)

  // Need to convert the build data to a format that the BuildPage component can use
  const buildState = extendedBuildToBuildState(build)
  if (!session?.user) {
    buildState.upvoted = false
    buildState.reported = false
  }

  // We need to convert the build.items object into an array of items to pass to the ToCsvButton
  const csvBuildData = buildStateToCsvData(buildState)
  const masonryItems = buildStateToMasonryItems(buildState)

  if (!isClient) return null

  return (
    <>
      <PageHeader
        title={buildState.name}
        subtitle={`Build by ${buildState.createdByDisplayName}`}
      />
      <ImageDownloadLink onClose={handleClearImageLink} imageLink={imageLink} />
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-xl flex-col items-start justify-center gap-2 sm:flex-row-reverse">
          <div
            id="actions-column"
            className="flex min-w-full flex-col justify-between gap-2 sm:min-w-[100px]"
          >
            <div className="col-span-full">
              <ActionButton.ExportImage
                imageExportLoading={imageExportLoading}
                onClick={() =>
                  handleImageExport(
                    buildContainerRef.current,
                    `${buildState.name}.png`,
                  )
                }
              />
            </div>

            {session && session.user?.id === buildState.createdById && (
              <ActionButton.EditBuild
                onClick={() =>
                  router.push(`/builder/edit/${buildState.buildId}`)
                }
              />
            )}

            <ActionButton.ShareBuild
              onClick={() =>
                handleCopyBuildUrl(
                  window.location.href,
                  'Copied Build URL to clipboard.',
                )
              }
            />
            <ActionButton.DuplicateBuild
              onClick={() => handleDuplicateBuild(buildState)}
            />
            <ToCsvButton
              data={csvBuildData.filter((item) => item?.name !== '')}
              filename={`remnant2_builder_${buildState.name}`}
              label="Export to CSV"
            />
            <ActionButton.ShowDetailedView
              onClick={() =>
                handleScrollToDetailedView(detailedViewContainerRef.current)
              }
            />
            {session?.user && (
              <>
                <hr className="my-4 hidden border-gray-500 sm:visible" />

                <div className="col-span-full flex w-full flex-col items-center justify-center gap-4">
                  <TotalUpvotes totalUpvotes={buildState.totalUpvotes} />

                  <div className="my-4 flex flex-row items-center justify-center gap-x-4 sm:my-0 sm:flex-col sm:items-start sm:gap-x-0 sm:gap-y-2">
                    <ActionButton.Vote
                      active={buildState.upvoted}
                      onClick={async () => {
                        const newVote = !buildState.upvoted

                        const response = newVote
                          ? await addVoteForBuild(
                              JSON.stringify({ buildId: build.id }),
                            )
                          : await removeVoteForBuild(
                              JSON.stringify({ buildId: build.id }),
                            )

                        if (isErrorResponse(response)) {
                          console.error(response.errors)
                          toast.error(
                            'Error voting for build. Please try again later.',
                          )
                        } else {
                          toast.success(response.message)
                          buildState.upvoted = newVote
                          buildState.totalUpvotes = response.totalUpvotes ?? 1
                          router.refresh()
                        }
                      }}
                    />

                    <ActionButton.ReportBuild
                      active={buildState.reported}
                      onClick={async () => {
                        const newReported = !buildState.reported

                        // prompt for the reason
                        const reason = newReported
                          ? prompt(
                              'Please enter a reason for reporting this build.',
                            )
                          : null

                        if (newReported && !reason) {
                          toast.error(
                            'You must enter a reason for reporting this build.',
                          )
                          return
                        }

                        const response = newReported
                          ? await addReportForBuild(
                              JSON.stringify({
                                buildId: build.id,
                                reason,
                              }),
                            )
                          : await removeReportForBuild(
                              JSON.stringify({ buildId: build.id }),
                            )

                        if (isErrorResponse(response)) {
                          console.error(response.errors)
                          toast.error(response.errors?.[0])
                        } else {
                          toast.success(response.message)
                          buildState.reported = newReported
                          router.refresh()
                        }
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div ref={buildContainerRef}>
            <Builder
              buildState={buildState}
              includeMemberFeatures={true}
              isEditable={false}
              isScreenshotMode={isScreenshotMode}
              showControls={showControls}
            />
          </div>
        </div>
        <div
          className="mt-12 flex w-full flex-col items-center justify-center gap-2"
          ref={detailedViewContainerRef}
        >
          <MasonryItemList items={masonryItems} />
        </div>
      </div>
    </>
  )
}
