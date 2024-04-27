'use client'

import { Disclosure } from '@headlessui/react'
import { FunnelIcon, TrashIcon } from '@heroicons/react/24/solid'
import isEqual from 'lodash.isequal'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'

import { BaseButton } from '@/app/(components)/_base/button'
import { BaseFieldGroup, BaseFieldset } from '@/app/(components)/_base/fieldset'
import { CategoriesFilter } from '@/app/(components)/filters/item-lookup-filters/categories-filter'
import { CollectionssFilter } from '@/app/(components)/filters/item-lookup-filters/collections-filter'
import { ItemSearchText } from '@/app/(components)/filters/item-lookup-filters/item-search-text'
import {
  ITEM_FILTER_KEYS,
  ItemLookupFilters as Filters,
} from '@/app/(components)/filters/item-lookup-filters/types'
import { parseUrlFilters } from '@/app/(components)/filters/item-lookup-filters/utils'
import { ReleasesFilter } from '@/app/(components)/filters/releases-filter'
import { DEFAULT_FILTER } from '@/app/(components)/filters/types'
import { allItems } from '@/app/(data)/items/all-items'
import { ITEM_TAGS } from '@/features/items/constants'
import { cn } from '@/lib/classnames'

function buildItemSearchTextItems() {
  {
    let items = allItems
      .filter((item) => item.category !== 'relicfragment')
      .map((item) => ({
        id: item.id,
        name: item.name,
      }))

    items = ITEM_TAGS.map((tag) => ({
      id: tag as string,
      name: tag as string,
    })).concat(items)

    items = items.sort((a, b) => a.name.localeCompare(b.name))

    // remove duplicates
    items = items.filter(
      (item, index, self) =>
        index === self.findIndex((i) => i.name === item.name),
    )

    return items
  }
}

export const DEFAULT_ITEM_LOOKUP_FILTERS = {
  categories: [DEFAULT_FILTER],
  collections: [DEFAULT_FILTER],
  releases: [DEFAULT_FILTER],
  searchText: '',
} as const satisfies Filters

interface Props {}

// #region Component
export function ItemLookupFilters({}: Props) {
  const searchParams = useSearchParams()
  const filters = parseUrlFilters(searchParams)

  /** Used to clear the SearchTextAutocomplete field when clear filters is pressed */
  const searchTextFieldKey = useRef(new Date().getTime())

  const [unappliedFilters, setUnappliedFilters] = useState(filters)

  function clearFilters() {
    setUnappliedFilters(DEFAULT_ITEM_LOOKUP_FILTERS)
    applyUrlFilters(DEFAULT_ITEM_LOOKUP_FILTERS)
    searchTextFieldKey.current = new Date().getTime()
  }

  const areAnyFiltersActive = useMemo(() => {
    if (isEqual(filters, DEFAULT_ITEM_LOOKUP_FILTERS)) return false
    return true
  }, [filters])

  // #region Apply Filters Handler
  const pathname = usePathname()
  const router = useRouter()
  function applyUrlFilters(filtersToApply: Filters) {
    let url = `${pathname}?`

    // Add the categories filter
    if (!filtersToApply.categories.some((i) => i === DEFAULT_FILTER)) {
      url += `${ITEM_FILTER_KEYS.CATEGORIES}=${filtersToApply.categories.join(
        ',',
      )}&`
    }

    // Add the collections filter
    if (!filtersToApply.collections.some((i) => i === DEFAULT_FILTER)) {
      url += `${ITEM_FILTER_KEYS.COLLECTIONS}=${filtersToApply.collections.join(
        ',',
      )}&`
    }

    // Add the releases filter
    if (!filtersToApply.releases.some((i) => i === DEFAULT_FILTER)) {
      url += `${ITEM_FILTER_KEYS.RELEASES}=${filtersToApply.releases.join(
        ',',
      )}&`
    }

    // Add the search text filter
    if (filtersToApply.searchText.length > 0) {
      url += `${ITEM_FILTER_KEYS.SEARCHTEXT}=${filtersToApply.searchText}&`
    }

    // trim the final &
    if (url.endsWith('&')) {
      url = url.slice(0, -1)
    }

    router.push(url, { scroll: false })
  }

  // #region Filter Change Handlers

  function handleSearchTextChange(newSearchText: string) {
    setUnappliedFilters((prev) => ({ ...prev, searchText: newSearchText }))
  }

  function handleCategoriesChange(newCategories: string[]) {
    // if the newCategories length is 0, set to default
    if (newCategories.length === 0) {
      const newFilters = { ...unappliedFilters, categories: [DEFAULT_FILTER] }
      setUnappliedFilters(newFilters)
      applyUrlFilters(newFilters)
      return
    }

    // if the first item is the default value ("All"), apply the filters after removing the default value
    if (newCategories[0] === DEFAULT_FILTER) {
      const newFilters = {
        ...unappliedFilters,
        categories: newCategories.filter((i) => i !== DEFAULT_FILTER),
      }
      setUnappliedFilters(newFilters)
      applyUrlFilters(newFilters)
      return
    }

    // if any of the filters contain the default value of "All", just apply the filters
    if (newCategories.includes(DEFAULT_FILTER)) {
      const newFilters = { ...unappliedFilters, categories: newCategories }
      setUnappliedFilters(newFilters)
      applyUrlFilters(newFilters)
      return
    }

    // If we got here, remove the default value from the list
    const newFilters = {
      ...unappliedFilters,
      categories: newCategories.filter((i) => i !== DEFAULT_FILTER),
    }
    setUnappliedFilters(newFilters)
    applyUrlFilters(newFilters)
  }

  function handleCollectionsChange(newCollections: string[]) {
    // if the newCollections length is 0, set to default
    if (newCollections.length === 0) {
      const newFilters = { ...unappliedFilters, collections: [DEFAULT_FILTER] }
      setUnappliedFilters(newFilters)
      applyUrlFilters(newFilters)
      return
    }

    // if the first item is the default value ("All"), apply the filters after removing the default value
    if (newCollections[0] === DEFAULT_FILTER) {
      const newFilters = {
        ...unappliedFilters,
        collections: newCollections.filter((i) => i !== DEFAULT_FILTER),
      }
      setUnappliedFilters(newFilters)
      applyUrlFilters(newFilters)
      return
    }

    // if any of the filters contain the default value of "All", just apply the filters
    if (newCollections.includes(DEFAULT_FILTER)) {
      const newFilters = { ...unappliedFilters, collections: [DEFAULT_FILTER] }
      setUnappliedFilters(newFilters)
      applyUrlFilters(newFilters)
      return
    }

    // If we got here, remove the default value from the list
    const newFilters = {
      ...unappliedFilters,
      collections: newCollections.filter((i) => i !== DEFAULT_FILTER),
    }
    setUnappliedFilters(newFilters)
    applyUrlFilters(newFilters)
  }

  function handleReleasesChange(newReleases: string[]) {
    // if the newReleases length is 0, set to default value
    if (newReleases.length === 0) {
      const newFilters = { ...unappliedFilters, releases: [DEFAULT_FILTER] }
      setUnappliedFilters(newFilters)
      applyUrlFilters(newFilters)
      return
    }

    // if the first item is the default value ("All"), apply the filters after removing the default value
    if (newReleases[0] === DEFAULT_FILTER) {
      const newFilters = {
        ...unappliedFilters,
        releases: newReleases.filter((i) => i !== DEFAULT_FILTER),
      }
      setUnappliedFilters(newFilters)
      applyUrlFilters(newFilters)
      return
    }

    // if any of the filters contain the default value of "All", just apply the filters
    if (newReleases.includes(DEFAULT_FILTER)) {
      const newFilters = { ...unappliedFilters, releases: [DEFAULT_FILTER] }
      setUnappliedFilters(newFilters)
      applyUrlFilters(newFilters)
      return
    }

    // If we got here, remove the default value from the list
    const newFilters = {
      ...unappliedFilters,
      releases: newReleases.filter((i) => i !== DEFAULT_FILTER),
    }
    setUnappliedFilters(newFilters)
    applyUrlFilters(newFilters)
  }

  // #region Render

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <div className="w-full">
          <div className="flex w-full flex-row items-end justify-end border-b border-b-primary-500 py-2">
            <div className="flex w-full flex-row items-start justify-start pr-4">
              <div className="mr-1 w-full">
                <ItemSearchText
                  key={searchTextFieldKey.current}
                  items={buildItemSearchTextItems()}
                  onChange={(newSearchText: string) =>
                    handleSearchTextChange(newSearchText)
                  }
                  onKeyDown={() => applyUrlFilters(unappliedFilters)}
                  value={unappliedFilters.searchText}
                  autoFocus={true}
                />
              </div>
              {unappliedFilters.searchText !== '' ? (
                <BaseButton
                  color="red"
                  onClick={() => {
                    handleSearchTextChange('')
                    applyUrlFilters({
                      ...unappliedFilters,
                      searchText: '',
                    })
                    searchTextFieldKey.current = new Date().getTime()
                  }}
                  className="mt-2"
                >
                  <TrashIcon className="h-6 w-6" />
                </BaseButton>
              ) : (
                <div className="w-[48px]" />
              )}
            </div>
            <Disclosure.Button as={BaseButton}>
              <FunnelIcon className="h-4 w-4" />
              {open ? 'Hide' : 'Show'}
            </Disclosure.Button>
          </div>
          <Disclosure.Panel
            className={cn(
              'mt-2 w-full border border-cyan-500 bg-gray-950 p-4',
              areAnyFiltersActive &&
                'border-accent1-300 shadow-xl shadow-accent1-600',
            )}
          >
            <BaseFieldset>
              <BaseFieldGroup>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
                  <div className="col-span-full sm:col-span-1">
                    <ReleasesFilter
                      value={unappliedFilters.releases}
                      onChange={handleReleasesChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <CollectionssFilter
                      value={unappliedFilters.collections}
                      onChange={handleCollectionsChange}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-2">
                    <CategoriesFilter
                      value={unappliedFilters.categories}
                      onChange={handleCategoriesChange}
                    />
                  </div>
                </div>
                <div className="flex w-full items-center justify-end gap-x-4">
                  <BaseButton color="red" onClick={clearFilters}>
                    Clear Filters
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
