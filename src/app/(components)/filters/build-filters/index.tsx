'use client'

import { Disclosure } from '@headlessui/react'
import { FunnelIcon } from '@heroicons/react/24/solid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { BaseButton } from '@/app/(components)/_base/button'
import {
  BaseField,
  BaseFieldGroup,
  BaseFieldset,
  BaseLabel,
} from '@/app/(components)/_base/fieldset'
import { AmuletFilter } from '@/app/(components)/filters/build-filters/amulet-filter'
import { ArchetypeFilter } from '@/app/(components)/filters/build-filters/archetype-filter'
import { BuildMiscFilter } from '@/app/(components)/filters/build-filters/build-misc-filter'
import { BuildTagFilter } from '@/app/(components)/filters/build-filters/build-tag-filter'
import { HandGunFilter } from '@/app/(components)/filters/build-filters/hand-gun-filter'
import { LongGunFilter } from '@/app/(components)/filters/build-filters/long-gun-filter'
import { MeleeFilter } from '@/app/(components)/filters/build-filters/melee-filter'
import { ReleaseFilter } from '@/app/(components)/filters/build-filters/release-filter'
import { RingFilter } from '@/app/(components)/filters/build-filters/ring-filter'
import {
  BUILD_FILTER_KEYS,
  BuildListFilters,
  DEFAULT_FILTER,
  MAX_RINGS,
} from '@/app/(components)/filters/build-filters/types'
import { parseUrlFilters } from '@/app/(components)/filters/build-filters/utils'
import { Input } from '@/app/(components)/form-fields/input'
import { cn } from '@/lib/classnames'

const DEFAULT_FILTERS = {
  archetypes: [DEFAULT_FILTER],
  amulet: DEFAULT_FILTER,
  buildTags: [DEFAULT_FILTER],
  longGun: DEFAULT_FILTER,
  handGun: DEFAULT_FILTER,
  melee: DEFAULT_FILTER,
  releases: [DEFAULT_FILTER],
  rings: [DEFAULT_FILTER],
  searchText: '',
  patchAffected: false,
  withVideo: false,
  withReference: false,
}

interface Props {}

export function BuildFilters({}: Props) {
  const searchParams = useSearchParams()
  const filters = parseUrlFilters(searchParams)

  const [unappliedFilters, setUnappliedFilters] = useState(filters)

  function clearFilters() {
    setUnappliedFilters(DEFAULT_FILTERS)
    applyUrlFilters(DEFAULT_FILTERS)
  }

  const pathname = usePathname()
  const router = useRouter()
  function applyUrlFilters(filtersToApply: BuildListFilters) {
    let url = `${pathname}?t=${Date.now()}&`

    // Add the amulet filter
    if (filtersToApply.amulet !== 'All') {
      url += `${BUILD_FILTER_KEYS.AMULET}=${filtersToApply.amulet}&`
    }

    // Add the archetype filter
    if (filtersToApply.archetypes[0] !== 'All') {
      url += `${BUILD_FILTER_KEYS.ARCHETYPES}=${filtersToApply.archetypes.join(
        ',',
      )}&`
    }

    // Add the build tag filters
    if (filtersToApply.buildTags[0] !== 'All') {
      url += `${BUILD_FILTER_KEYS.BUILDTAGS}=${filtersToApply.buildTags.join(
        ',',
      )}&`
    }

    // Add the long gun filters
    if (filtersToApply.longGun !== 'All') {
      url += `${BUILD_FILTER_KEYS.LONGGUN}=${filtersToApply.longGun}&`
    }

    // Add the hand gun filters
    if (filtersToApply.handGun !== 'All') {
      url += `${BUILD_FILTER_KEYS.HANDGUN}=${filtersToApply.handGun}&`
    }

    // Add the melee filters
    if (filtersToApply.melee !== 'All') {
      url += `${BUILD_FILTER_KEYS.MELEE}=${filtersToApply.melee}&`
    }

    // Add the releases filters
    if (filtersToApply.releases[0] !== 'All') {
      url += `${BUILD_FILTER_KEYS.RELEASES}=${filtersToApply.releases.join(
        ',',
      )}&`
    }

    // Add the ring filters
    if (filtersToApply.rings[0] !== 'All') {
      url += `${BUILD_FILTER_KEYS.RINGS}=${filtersToApply.rings.join(',')}&`
    }

    // Add the search text
    if (filtersToApply.searchText) {
      url += `${BUILD_FILTER_KEYS.SEARCHTEXT}=${filtersToApply.searchText}&`
    }

    // Add the misc filters
    if (filtersToApply.patchAffected) {
      url += `${BUILD_FILTER_KEYS.PATCHAFFECTED}&`
    }
    if (filtersToApply.withVideo) {
      url += `${BUILD_FILTER_KEYS.WITHVIDEO}&`
    }
    if (filtersToApply.withReference) {
      url += `${BUILD_FILTER_KEYS.WITHREFERENCE}&`
    }

    // trim the final &
    if (url.endsWith('&')) {
      url = url.slice(0, -1)
    }

    router.push(url, { scroll: false })
  }

  function handleSearchTextChange(newSearchText: string) {
    setUnappliedFilters((prev) => ({ ...prev, searchText: newSearchText }))
  }

  function handleAmuletChange(newAmulet: string) {
    const newFilters = { ...unappliedFilters, amulet: newAmulet }
    setUnappliedFilters(newFilters)
  }

  function handleArchetypeChange(newArchetypes: string[]) {
    // if the archetypes length is 0, set the rings to the default value
    if (newArchetypes.length === 0) {
      const newFilters = { ...unappliedFilters, archetypes: ['All'] }
      setUnappliedFilters(newFilters)
      return
    }

    // If the only selection is the default value ("All"), just apply the filters
    if (newArchetypes.length === 1 && newArchetypes[0] === 'All') {
      const newFilters = { ...unappliedFilters, archetypes: newArchetypes }
      setUnappliedFilters(newFilters)
      return
    }

    // If we got here, remove the default value from the list
    const newFilters = {
      ...unappliedFilters,
      archetypes: newArchetypes.filter((archetype) => archetype !== 'All'),
    }
    setUnappliedFilters(newFilters)
  }

  function handleBuildTagChange(newBuildTags: string[]) {
    // if the newBuildTags length is 0, set the rings to the default value
    if (newBuildTags.length === 0) {
      const newFilters = { ...unappliedFilters, buildTags: ['All'] }
      setUnappliedFilters(newFilters)
      return
    }

    // If the only selection is the default value ("All"), just apply the filters
    if (newBuildTags.length === 1 && newBuildTags[0] === 'All') {
      const newFilters = { ...unappliedFilters, buildTags: newBuildTags }
      setUnappliedFilters(newFilters)
      return
    }

    // If we got here, remove the default value from the list
    const newFilters = {
      ...unappliedFilters,
      buildTags: newBuildTags.filter((buildTag) => buildTag !== 'All'),
    }
    setUnappliedFilters(newFilters)
  }

  function handleLongGunChange(newLongGun: string) {
    const newFilters = { ...unappliedFilters, longGun: newLongGun }
    setUnappliedFilters(newFilters)
  }

  function handleHandGunChange(newHandGun: string) {
    const newFilters = { ...unappliedFilters, handGun: newHandGun }
    setUnappliedFilters(newFilters)
  }

  function handleMeleeChange(newMelee: string) {
    const newFilters = { ...unappliedFilters, melee: newMelee }
    setUnappliedFilters(newFilters)
  }

  function handleReleaseChange(newReleases: string[]) {
    // if the newReleases length is 0, set the rings to the default value
    if (newReleases.length === 0) {
      const newFilters = { ...unappliedFilters, releases: ['All'] }
      setUnappliedFilters(newFilters)
      return
    }

    // If the only selection is the default value ("All"), just apply the filters
    if (newReleases.length === 1 && newReleases[0] === 'All') {
      const newFilters = { ...unappliedFilters, releases: newReleases }
      setUnappliedFilters(newFilters)
      return
    }

    // If we got here, remove the default value from the list
    const newFilters = {
      ...unappliedFilters,
      releases: newReleases.filter((release) => release !== 'All'),
    }
    setUnappliedFilters(newFilters)
  }

  function handleRingChange(newRings: string[]) {
    // if the newRings length is more than the max rings, return
    if (newRings.length > MAX_RINGS) return

    // if the newRings length is 0, set the rings to the default value
    if (newRings.length === 0) {
      const newFilters = { ...unappliedFilters, rings: ['All'] }
      setUnappliedFilters(newFilters)
      return
    }

    // If the only selection is the default value ("All"), just apply the filters
    if (newRings.length === 1 && newRings[0] === 'All') {
      const newFilters = { ...unappliedFilters, rings: newRings }
      setUnappliedFilters(newFilters)
      return
    }

    // If we got here, remove the default value from the list
    const newFilters = {
      ...unappliedFilters,
      rings: newRings.filter((ring) => ring !== 'All'),
    }
    setUnappliedFilters(newFilters)
  }

  function handleMiscFilterChange(newFilters: string[]) {
    const patchAffected = newFilters.includes('patchAffected')
    const withVideo = newFilters.includes('withVideo')
    const withReference = newFilters.includes('withReference')

    setUnappliedFilters((prev) => ({
      ...prev,
      patchAffected,
      withVideo,
      withReference,
    }))
  }

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <div className="mb-4 w-full">
          <div
            className={cn(
              'mb-2 flex w-full flex-row items-end justify-end border-b border-b-primary-500 py-2',
            )}
          >
            <h2 className="flex w-full items-center justify-start text-xl">
              Build Filters
            </h2>
            <Disclosure.Button as={BaseButton}>
              <FunnelIcon className="h-4 w-4" />
              {open ? 'Hide' : 'Show'}
            </Disclosure.Button>
          </div>
          <Disclosure.Panel className="w-full border border-cyan-500 bg-gray-950 p-4">
            <BaseFieldset>
              <BaseFieldGroup>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  <BaseField className="col-span-full md:col-span-2">
                    <BaseLabel>Search</BaseLabel>
                    <div className="mt-3">
                      <Input
                        type="text"
                        value={unappliedFilters.searchText}
                        placeholder="Build name, description, or creator"
                        onClear={() => {
                          const newFilters = {
                            ...unappliedFilters,
                            searchText: '',
                          }
                          setUnappliedFilters(newFilters)
                          applyUrlFilters(newFilters)
                        }}
                        onChange={(e) => handleSearchTextChange(e.target.value)}
                        onKeyDown={(e) => {
                          // If the user presses enter, apply the filters
                          if (e.key === 'Enter') {
                            applyUrlFilters(unappliedFilters)
                          }
                        }}
                      />
                    </div>
                  </BaseField>
                  <div className="col-span-full sm:col-span-1">
                    <ArchetypeFilter
                      value={unappliedFilters.archetypes}
                      onChange={handleArchetypeChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <LongGunFilter
                      value={unappliedFilters.longGun}
                      onChange={handleLongGunChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <MeleeFilter
                      value={unappliedFilters.melee}
                      onChange={handleMeleeChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <HandGunFilter
                      value={unappliedFilters.handGun}
                      onChange={handleHandGunChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <AmuletFilter
                      value={unappliedFilters.amulet}
                      onChange={handleAmuletChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <RingFilter
                      value={unappliedFilters.rings}
                      onChange={handleRingChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <ReleaseFilter
                      value={unappliedFilters.releases}
                      onChange={handleReleaseChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <BuildTagFilter
                      value={unappliedFilters.buildTags}
                      onChange={handleBuildTagChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <BuildMiscFilter
                      value={[
                        unappliedFilters.patchAffected ? 'patchAffected' : '',
                        unappliedFilters.withVideo ? 'withVideo' : '',
                        unappliedFilters.withReference ? 'withReference' : '',
                      ]}
                      onChange={handleMiscFilterChange}
                    />
                  </div>
                </div>
                <div className="flex w-full items-center justify-end gap-x-4">
                  <BaseButton color="red" onClick={clearFilters}>
                    Clear Filters
                  </BaseButton>
                  <BaseButton
                    color="green"
                    onClick={() => applyUrlFilters(unappliedFilters)}
                  >
                    Apply Filters
                  </BaseButton>
                </div>
              </BaseFieldGroup>
            </BaseFieldset>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
