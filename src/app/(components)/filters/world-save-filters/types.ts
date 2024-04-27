import { ReleaseKey } from '@/app/(data)/releases/types'
import { BOSS_AFFIXES, BOSSES } from '@/app/(data)/world-saves/constants'

export const DEFAULT_FILTER = 'All'
export type DefaultFilter = typeof DEFAULT_FILTER

export interface WorldSaveFilters {
  bossName: string | DefaultFilter
  bossAffixes: string[] | [DefaultFilter]
  releases: string[] | [DefaultFilter]
}

/** The keys used in the URL for the filters */
export const WORLD_SAVE_FILTER_KEYS = {
  BOSSNAME: 'bossName',
  BOSSAFFIXES: 'bossAffixes',
  RELEASES: 'releases',
} as const satisfies Record<string, keyof WorldSaveFilters>

export type BossAffix = keyof typeof BOSS_AFFIXES
export type BossAffixName = (typeof BOSS_AFFIXES)[number]['name']

export type BossName = (typeof BOSSES)[number]['name']

export interface WorldSave {
  bossName: BossName
  bossAffixes: BossAffixName[]
  release: ReleaseKey
}

export type FilteredWorldSave = WorldSave & { imagePath: string }
