import { DefaultFilter } from '@/app/(components)/filters/types'

export interface ItemLookupFilters {
  categories: string[] | [DefaultFilter]
  collections: string[] | [DefaultFilter]
  releases: string[] | [DefaultFilter]
  searchText: string
}

/** The keys used in the URL for the filters */
export const ITEM_FILTER_KEYS = {
  CATEGORIES: 'categories',
  COLLECTIONS: 'collections',
  RELEASES: 'releases',
  SEARCHTEXT: 'searchText',
} as const satisfies Record<string, keyof ItemLookupFilters>

export const DEFAULT_ITEM_CATEGORIES = [
  'Helm',
  'Torso',
  'Legs',
  'Gloves',
  'Archetype',
  'Skill',
  'Trait',
  'Perk',
  'Amulet',
  'Ring',
  'Relic',
  'Relicfragment',
  'Long Gun',
  'Hand Gun',
  'Melee',
  'Mod',
  'Mutator (Gun)',
  'Mutator (Melee)',
  'Concoction',
  'Consumable',
]
