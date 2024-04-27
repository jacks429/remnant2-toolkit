import { ReadonlyURLSearchParams } from 'next/navigation'

import { ItemLookupFilters } from '@/app/(components)/filters/item-lookup-filters/types'
import { allItems } from '@/app/(data)/items/all-items'
import { ITEM_TAGS } from '@/features/items/constants'

export function buildAutoCompleteSuggestions(): Array<{
  id: string
  name: string
}> {
  let items = allItems
    // Remove relic fragments
    .filter((item) => item.category !== 'relicfragment')
    .map((item) => ({
      id: item.id,
      name: item.name,
    }))

  // add item tags
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

export function parseUrlFilters(
  searchParams: ReadonlyURLSearchParams,
): ItemLookupFilters {
  const parsedParams = new URLSearchParams(searchParams)

  // validate the provided categories
}
