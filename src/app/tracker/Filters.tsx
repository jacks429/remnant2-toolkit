import { useCallback, useEffect, useState } from 'react'
import { useDebounceValue, useLocalStorage } from 'usehooks-ts'

import { ClearFiltersButton } from '@/features/filters/components/parts/ClearFiltersButton'
import { RELEASE_TO_NAME } from '@/features/items/constants'
import { FilteredItem } from '@/features/items/hooks/useFilteredItems'
import { ReleaseKey } from '@/features/items/types'
import { MutatorItem } from '@/features/items/types/MutatorItem'
import { WeaponItem } from '@/features/items/types/WeaponItem'
import { Checkbox } from '@/features/ui/Checkbox'
import { SearchInput } from '@/features/ui/SearchInput'
import { SelectMenu } from '@/features/ui/SelectMenu'
import { cn } from '@/lib/classnames'

import { ItemTrackerCategory, LocalStorage } from './types'

const DEFAULT_ITEM_CATEGORY: ItemTrackerCategory = 'archetype'

function doFilterItems({
  allItems,
  debouncedSearchText,
  discoveredItemIds,
  includedCollectionKeys,
  includedDlcKeys,
  selectedItemCategory,
}: {
  allItems: FilteredItem[]
  debouncedSearchText: string
  discoveredItemIds: string[]
  includedCollectionKeys: string[]
  includedDlcKeys: ReleaseKey[]
  selectedItemCategory: ItemTrackerCategory
}) {
  // Add discovered to the items
  let filteredItems = allItems.map((item) => ({
    ...item,
    discovered: discoveredItemIds.includes(item.id),
  }))

  // Filter out the search text
  filteredItems = filteredItems.filter(
    (item) =>
      item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
      item.description
        ?.toLowerCase()
        .includes(debouncedSearchText.toLowerCase()),
  )

  // Filter out the collections
  filteredItems = filteredItems.filter((item) => {
    if (
      includedCollectionKeys.includes('Discovered') &&
      includedCollectionKeys.includes('Undiscovered')
    ) {
      return true
    } else if (includedCollectionKeys.includes('Undiscovered')) {
      return item.discovered === false
    } else if (includedCollectionKeys.includes('Discovered')) {
      return item.discovered === true
    } else {
      return false
    }
  })

  // Filter out the DLCs
  filteredItems = filteredItems.filter((item) => {
    if (item.dlc === undefined) {
      return includedDlcKeys.includes('base')
    }

    return includedDlcKeys.includes(item.dlc as ReleaseKey)
  })

  // Filter out the categories
  filteredItems = filteredItems.filter((item) => {
    if (WeaponItem.isWeaponItem(item) && item.type === 'long gun') {
      return selectedItemCategory === 'long gun'
    } else if (WeaponItem.isWeaponItem(item) && item.type === 'hand gun') {
      return selectedItemCategory === 'hand gun'
    } else if (WeaponItem.isWeaponItem(item) && item.type === 'melee') {
      return selectedItemCategory === 'melee'
    } else if (MutatorItem.isMutatorItem(item) && item.type === 'gun') {
      return selectedItemCategory === 'mutator (gun)'
    } else if (MutatorItem.isMutatorItem(item) && item.type === 'melee') {
      return selectedItemCategory === 'mutator (melee)'
    } else {
      return item.category === selectedItemCategory
    }
  })

  return filteredItems
}

interface Props {
  allItems: FilteredItem[]
  itemCategoryOptions: Array<{ label: string; value: string }>
  showBorder?: boolean
  onUpdate: (filteredItems: FilteredItem[]) => void
}

export function Filters({
  allItems,
  itemCategoryOptions,
  showBorder = true,
  onUpdate,
}: Props) {
  const [tracker] = useLocalStorage<LocalStorage>(
    'item-tracker',
    {
      discoveredItemIds: [],
      collapsedCategories: [],
    },
    { initializeWithValue: false },
  )
  const { discoveredItemIds } = tracker

  function clearFilters() {
    setSearchText('')
    setIncludedDlcKeys(defaultReleaseKeys)
    setIncludedCollectionKeys(defaultCollectionKeys)
    updateFilteredItems()
  }

  const areAnyFiltersActive = () => {
    return (
      searchText !== '' ||
      includedDlcKeys.length !== defaultReleaseKeys.length ||
      includedCollectionKeys.length !== defaultCollectionKeys.length
    )
  }

  /**
   * ------------------------------------
   * Search Text
   * ------------------------------------
   */
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText] = useDebounceValue(searchText, 500)

  function handleSearchTextChange(newValue: string) {
    setSearchText(newValue)
  }

  /**
   * ------------------------------------
   * DLC Filters
   * ------------------------------------
   */

  const defaultReleaseKeys: ReleaseKey[] = ['base', 'dlc1']
  const [includedDlcKeys, setIncludedDlcKeys] =
    useState<ReleaseKey[]>(defaultReleaseKeys)

  function handleDlcFilterChange(releaseKey: ReleaseKey) {
    if (includedDlcKeys.includes(releaseKey)) {
      setIncludedDlcKeys(includedDlcKeys.filter((key) => key !== releaseKey))
    } else {
      setIncludedDlcKeys([...includedDlcKeys, releaseKey])
    }
  }

  /**
   * ------------------------------------
   * Collection Filters
   * ------------------------------------
   */

  const defaultCollectionKeys = ['Discovered', 'Undiscovered']
  const [includedCollectionKeys, setIncludedCollectionKeys] = useState<
    typeof defaultCollectionKeys
  >(defaultCollectionKeys)

  function handleCollectionFilterChange(collectionKey: string) {
    if (includedCollectionKeys.includes(collectionKey)) {
      setIncludedCollectionKeys(
        includedCollectionKeys.filter((key) => key !== collectionKey),
      )
    } else {
      setIncludedCollectionKeys([...includedCollectionKeys, collectionKey])
    }
  }

  /**
   * ------------------------------------
   * Category Filters
   * ------------------------------------
   */
  const [selectedItemCategory, setSelectedItemCategory] =
    useState<ItemTrackerCategory>(DEFAULT_ITEM_CATEGORY)

  function handleItemCategoryFilterChange(category: ItemTrackerCategory) {
    setSelectedItemCategory(category)
    updateFilteredItems()
  }

  const updateFilteredItems = useCallback(() => {
    const filteredItems = doFilterItems({
      allItems,
      debouncedSearchText,
      discoveredItemIds,
      includedCollectionKeys,
      includedDlcKeys,
      selectedItemCategory,
    })
    onUpdate(filteredItems)
  }, [
    allItems,
    debouncedSearchText,
    discoveredItemIds,
    includedCollectionKeys,
    includedDlcKeys,
    selectedItemCategory,
    onUpdate,
  ])

  /**
   * ------------------------------------
   * Updates the filters when the search
   * text changes
   * ------------------------------------
   */
  useEffect(() => {
    updateFilteredItems()
  }, [debouncedSearchText, updateFilteredItems])

  return (
    <div
      className={cn(
        'border-secondary-500 shadow-secondary-500/50 relative h-full max-h-fit w-full transform overflow-y-auto border-2 bg-black px-4 pb-4 pt-4 text-left shadow-lg sm:my-8 sm:p-6',
        !showBorder && 'border-transparent',
        showBorder &&
          areAnyFiltersActive() &&
          'border-primary-500 shadow-primary-500/50 shadow-xl',
      )}
    >
      <div className="grid-cols-full grid gap-x-8 gap-y-4  bg-black sm:grid-cols-4">
        <div className="border-b-primary-800 col-span-full border border-transparent pb-8 pt-2 sm:col-span-2">
          <div className="flex w-full flex-col items-start justify-start gap-x-4">
            <span className="text-primary-500 mb-2 flex items-center justify-start text-left text-sm font-bold">
              Search
            </span>
            <div className="w-full">
              <SearchInput
                onChange={handleSearchTextChange}
                value={searchText}
                placeholder={'Search item names and descriptions'}
              />
            </div>
          </div>
        </div>

        <div className="border-b-primary-800 col-span-full border border-transparent pb-8 pt-2 sm:col-span-2">
          <div className="flex w-full flex-col items-start justify-start gap-x-4">
            <div className="w-full">
              <SelectMenu
                label="Category"
                value={selectedItemCategory as string}
                options={itemCategoryOptions.map((option) =>
                  option.value === 'relicfragment'
                    ? { label: 'Relic Fragment', value: 'relicfragment' }
                    : option,
                )}
                onChange={(e) =>
                  handleItemCategoryFilterChange(
                    e.target.value as ItemTrackerCategory,
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="col-span-full pt-2 sm:col-span-2">
          <div className="flex w-full flex-col items-start justify-start gap-x-4 gap-y-2">
            <span className="text-primary-500 flex items-start justify-start text-left text-sm font-bold">
              By Release
            </span>
            <div className="text-xs">
              <button
                className="underline"
                aria-label="Uncheck all DLCs"
                onClick={() => {
                  setIncludedDlcKeys([])
                  updateFilteredItems()
                }}
              >
                Uncheck All
              </button>{' '}
              /{' '}
              <button
                className="underline"
                aria-label="Check all DLCs"
                onClick={() => {
                  setIncludedDlcKeys(defaultReleaseKeys)
                  updateFilteredItems()
                }}
              >
                Check All
              </button>
            </div>
            <div className="grid grid-cols-2 text-left">
              {defaultReleaseKeys.map((key) => {
                const dlcName = RELEASE_TO_NAME[key]
                return (
                  <div key={key}>
                    <Checkbox
                      label={dlcName}
                      name={`dlc-${key}`}
                      checked={includedDlcKeys.includes(key)}
                      onChange={() => handleDlcFilterChange(key)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="col-span-full pt-2 sm:col-span-2">
          <div className="flex w-full flex-col items-start justify-start gap-x-4 gap-y-2">
            <span className="text-primary-500 flex items-start justify-start text-left text-sm font-bold">
              By Collection
            </span>
            <div className="text-xs">
              <button
                className="underline"
                aria-label="Uncheck all collections"
                onClick={() => {
                  setIncludedCollectionKeys([])
                  updateFilteredItems()
                }}
              >
                Uncheck All
              </button>{' '}
              /{' '}
              <button
                className="underline"
                aria-label="Check all collections"
                onClick={() => {
                  setIncludedCollectionKeys(defaultCollectionKeys)
                  updateFilteredItems()
                }}
              >
                Check All
              </button>
            </div>
            <div className="grid grid-cols-2 text-left">
              {defaultCollectionKeys.map((key) => {
                return (
                  <div key={key}>
                    <Checkbox
                      label={key}
                      name={`collection-${key}`}
                      checked={includedCollectionKeys.includes(key)}
                      onChange={() => handleCollectionFilterChange(key)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {areAnyFiltersActive() && (
          <div className="col-span-full flex items-center justify-end pt-4">
            <ClearFiltersButton onClick={clearFilters} />
          </div>
        )}
      </div>
    </div>
  )
}
