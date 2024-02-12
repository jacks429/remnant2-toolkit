import { Item } from '@/features/items/types'
import { BuildState } from '../types'
import getArrayOfLength from './getArrayOfLength'
import { ArchetypeItem } from '@/features/items/types/ArchetypeItem'
import { SkillItem } from '@/features/items/types/SkillItem'
import { RelicFragmentItem } from '@/features/items/types/RelicFragmentItem'
import { RingItem } from '@/features/items/types/RingItem'
import { WeaponItem } from '@/features/items/types/WeaponItem'
import { MutatorItem } from '@/features/items/types/MutatorItem'

export function buildStateToMasonryItems(build: BuildState): Item[] {
  const masonryItems: Item[] = []
  const { items } = build

  // archtypes
  getArrayOfLength(2).forEach((_, i) => {
    items.archetype[i] && masonryItems.push(items.archetype[i] as ArchetypeItem)
    items.skill[i] && masonryItems.push(items.skill[i] as SkillItem)
  })

  // armor
  items.helm && masonryItems.push(items.helm)
  items.torso && masonryItems.push(items.torso)
  items.legs && masonryItems.push(items.legs)
  items.gloves && masonryItems.push(items.gloves)
  items.relic && masonryItems.push(items.relic)
  getArrayOfLength(3).forEach((_, i) => {
    if (!items.relicfragment[i]) return
    items.relicfragment[i] &&
      masonryItems.push(items.relicfragment[i] as RelicFragmentItem)
  })
  items.amulet && masonryItems.push(items.amulet)
  getArrayOfLength(4).forEach((_, i) => {
    if (!items.ring[i]) return
    items.ring[i] && masonryItems.push(items.ring[i] as RingItem)
  })

  // weapons
  getArrayOfLength(3).forEach((_, i) => {
    items.weapon[i] && masonryItems.push(items.weapon[i] as WeaponItem)
    items.mod[i] && masonryItems.push(items.mod[i] as Item)
    items.mutator[i] && masonryItems.push(items.mutator[i] as MutatorItem)
  })

  // traits
  items.trait.forEach((trait) => trait && masonryItems.push(trait))

  // concoctions
  items.concoction.forEach(
    (concoction) => concoction && masonryItems.push(concoction),
  )

  // consumables
  items.consumable.forEach(
    (consumable) => consumable && masonryItems.push(consumable),
  )

  return masonryItems
}
