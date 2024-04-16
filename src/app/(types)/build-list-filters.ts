import { BuildTagFilterItem } from '@/features/build/filters/parts/BuildTagFilters'
import { Archetype, ReleaseKey } from '@/features/items/types'

export interface BuildListFilters {
  amulet: string
  archetypes: Archetype[]
  buildTags: BuildTagFilterItem[]
  handGun: string
  longGun: string
  melee: string
  ring1: string
  ring2: string
  ring3: string
  ring4: string
  searchText: string
  selectedReleases: ReleaseKey[]
  includePatchAffectedBuilds: boolean
  limitToBuildsWithVideo: boolean
  limitToBuildsWithReferenceLink: boolean
}
