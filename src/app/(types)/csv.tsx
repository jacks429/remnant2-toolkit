import { ItemCategory } from '@/features/build/types'

/**
 * The minimum information that should be
 * written in a CSV export for each item
 */
export interface CsvItem {
  name: string
  category: ItemCategory
  description: string
  wikiLinks: string
}
