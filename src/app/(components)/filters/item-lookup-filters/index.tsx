import { useSearchParams } from 'next/navigation'

import {
  DEFAULT_FILTER,
  DEFAULT_ITEM_CATEGORIES,
  ItemLookupFilters as Filters,
} from '@/app/(components)/filters/item-lookup-filters/types'

export const DEFAULT_FILTERS: Filters = {
  categories: [],
  collections: [DEFAULT_FILTER],
  releases: [DEFAULT_FILTER],
  searchText: '',
}

interface Props {}

// #region Component
export function ItemLookupFilters({}: Props) {
  const searchParams = useSearchParams()
  const filters = parseUrlFilters(searchParams)
}
