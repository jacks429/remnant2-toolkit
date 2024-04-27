import { ReadonlyURLSearchParams } from 'next/navigation'

import {
  ITEM_FILTER_KEYS,
  ItemLookupFilters,
} from '@/app/(components)/filters/item-lookup-filters/types'
import { DEFAULT_FILTER } from '@/app/(components)/filters/types'
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
  let categories =
    parsedParams.get(ITEM_FILTER_KEYS.CATEGORIES)?.split(',') || []
  // If categories is the default, convert it to an array
  // Else ensure that the categories provided are valid
  if (categories.length === 0) {
    categories = [DEFAULT_FILTER]
  } else {
    categories = categories.filter((category) => category.length > 0)
    // If no categories, set to default
    if (categories.length === 0) {
      categories = [DEFAULT_FILTER]
    }
  }

  // validate the provided collections
  let collections =
    parsedParams.get(ITEM_FILTER_KEYS.COLLECTIONS)?.split(',') || []
  // If collections is the default, convert it to an array
  // Else ensure that the collections provided are valid
  if (collections.length === 0) {
    collections = [DEFAULT_FILTER]
  } else {
    collections = collections.filter((collection) => collection.length > 0)
    // If no collections, set to default
    if (collections.length === 0) {
      collections = [DEFAULT_FILTER]
    }
  }

  // validate the provided releases
  let releases = parsedParams.get(ITEM_FILTER_KEYS.RELEASES)?.split(',') || []
  // If releases is the default, convert it to an array
  // Else ensure that the releases provided are valid
  if (releases.length === 0) {
    releases = [DEFAULT_FILTER]
  } else {
    releases = releases.filter((release) => release.length > 0)
    // If no releases, set to default
    if (releases.length === 0) {
      releases = [DEFAULT_FILTER]
    }
  }

  // validate the provided searchText
  let searchText = parsedParams.get(ITEM_FILTER_KEYS.SEARCHTEXT) || ''

  return {
    categories,
    collections,
    releases,
    searchText,
  }
}
