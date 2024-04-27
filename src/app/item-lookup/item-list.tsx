'use client'

import isEqual from 'lodash.isequal'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { v4 as uuidv4 } from 'uuid'

import { BaseButton } from '@/app/(components)/_base/button'
import { DEFAULT_ITEM_LOOKUP_FILTERS } from '@/app/(components)/filters/item-lookup-filters'
import { ItemLookupFilters } from '@/app/(components)/filters/item-lookup-filters/types'
import { parseUrlFilters } from '@/app/(components)/filters/item-lookup-filters/utils'
import { DEFAULT_FILTER } from '@/app/(components)/filters/types'
import { allItems } from '@/app/(data)/items/all-items'
import { MutatorItem } from '@/app/(data)/items/types/MutatorItem'
import { WeaponItem } from '@/app/(data)/items/types/WeaponItem'
import { ItemTrackerLocalStorage } from '@/app/tracker/(lib)/types'
import { MasonryItemList } from '@/features/items/components/MasonryItemList'
import { itemMatchesSearchText } from '@/features/items/lib/itemMatchesSearchText'
import { Item } from '@/features/items/types'
import { capitalize } from '@/lib/capitalize'

const allItemsWithDiscovered = allItems.map((item) => ({
  ...item,
  discovered: false,
}))

function getFilteredItems(
  filters: ItemLookupFilters,
  discoveredItemIds: string[],
): Array<Item & { discovered: boolean }> {
  let filteredItems = allItemsWithDiscovered.map((item) => ({
    ...item,
    discovered: discoveredItemIds.includes(item.id),
  }))

  // if categories are not default, filter by categories
  if (
    filters.categories.length > 0 &&
    !filters.categories.some((c) => c === DEFAULT_FILTER)
  ) {
    filteredItems = filteredItems.filter((item) => {
      if (item.category === undefined) {
        return true
      }

      return filters.categories.some((itemCategory) => {
        if (itemCategory === 'Long Gun' && WeaponItem.isWeaponItem(item)) {
          return item.category === 'weapon' && item.type === 'long gun'
        }
        if (itemCategory === 'Hand Gun' && WeaponItem.isWeaponItem(item)) {
          return item.category === 'weapon' && item.type === 'hand gun'
        }
        if (itemCategory === 'Melee' && WeaponItem.isWeaponItem(item)) {
          return item.category === 'weapon' && item.type === 'melee'
        }
        if (
          itemCategory === 'Mutator (Gun)' &&
          MutatorItem.isMutatorItem(item)
        ) {
          return item.category === 'mutator' && item.type === 'gun'
        }
        if (
          itemCategory === 'Mutator (Melee)' &&
          MutatorItem.isMutatorItem(item)
        ) {
          return item.category === 'mutator' && item.type === 'melee'
        }

        return capitalize(item.category) === itemCategory
      })
    })
  }

  // if collections are not default, filter by collections
  if (
    filters.collections.length > 0 &&
    !filters.collections.some((c) => c === DEFAULT_FILTER)
  ) {
    filteredItems = filteredItems.filter((item) => {
      if (
        filters.collections
          .filter((i) => i !== DEFAULT_FILTER)
          .includes('Discovered') &&
        filters.collections
          .filter((i) => i !== DEFAULT_FILTER)
          .includes('Undiscovered')
      ) {
        return true
      } else if (
        filters.collections
          .filter((i) => i !== DEFAULT_FILTER)
          .includes('Undiscovered')
      ) {
        return item.discovered === false
      } else if (
        filters.collections
          .filter((i) => i !== DEFAULT_FILTER)
          .includes('Discovered')
      ) {
        return item.discovered === true
      } else {
        return false
      }
    })
  }

  // if releases are not default, filter by releases
  if (
    filters.releases.length > 0 &&
    !filters.releases.some((r) => r === DEFAULT_FILTER)
  ) {
    filteredItems = filteredItems.filter((item) =>
      filters.releases
        .filter((release) => release !== DEFAULT_FILTER)
        .includes(item.dlc),
    )
  }

  // Filter by search text
  filteredItems = filteredItems.filter((item) =>
    itemMatchesSearchText({ item, searchText: filters.searchText }),
  )

  // Sort alphabetically by item.category and item.name
  filteredItems = filteredItems.sort((a, b) => {
    if (a.category < b.category) return -1
    if (a.category > b.category) return 1
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })

  return filteredItems
}

interface Props {}

export function ItemList({}: Props) {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState(parseUrlFilters(searchParams))

  const [areFiltersApplied, setAreFiltersApplied] = useState(
    !isEqual(filters, DEFAULT_ITEM_LOOKUP_FILTERS),
  )

  useEffect(() => {
    setFilters(parseUrlFilters(searchParams))
  }, [searchParams])

  useEffect(() => {
    if (!isEqual(filters, DEFAULT_ITEM_LOOKUP_FILTERS)) {
      setAreFiltersApplied(true)
    }
  }, [filters])

  const [tracker] = useLocalStorage<ItemTrackerLocalStorage>(
    'item-tracker',
    {
      discoveredItemIds: [],
      collapsedCategories: [],
    },
    { initializeWithValue: false },
  )
  const { discoveredItemIds } = tracker

  let filteredItems = getFilteredItems(filters, discoveredItemIds)

  // #region Render

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-auto p-4">
      {!areFiltersApplied && (
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h2 className="text-center text-2xl font-bold text-primary-500">
            Apply a filter to see the items.
          </h2>

          <BaseButton onClick={() => setAreFiltersApplied(true)}>
            Show All
          </BaseButton>
        </div>
      )}
      {filteredItems.length === 0 && (
        <h2 className="text-center text-2xl font-bold text-primary-500">
          No items found
        </h2>
      )}

      {areFiltersApplied ? (
        <MasonryItemList
          key={uuidv4()}
          label={`Items (${filteredItems.length} Total)`}
          items={filteredItems}
          allowItemCompare={true}
        />
      ) : null}
    </div>
  )
}
