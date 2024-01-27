import { remnantItemCategories } from '@/features/items/data'
import { BuildState } from '../types'
import { itemToCsvItem } from '@/features/items/lib/itemToCsvItem'
import { GenericItem } from '@/features/items/types/GenericItem'
import { TraitItem } from '@/features/items/types/TraitItem'

/**
 * Converts the build state into a CSV file
 */
export function buildStateToCsvData(buildState: BuildState) {
  return remnantItemCategories
    .map((category) => {
      const itemOrItems = buildState.items[category]

      const emptyItem = {
        name: '',
        category,
        description: '',
        howToGet: '',
        wikiLinks: '',
      }

      if (!itemOrItems) return emptyItem

      if (Array.isArray(itemOrItems)) {
        // If the category is a trait, we need to add the trait amount to the name
        if (category === 'trait') {
          return itemOrItems.map((item) => {
            if (!item) return emptyItem
            if (!TraitItem.isTraitItem(item)) return itemToCsvItem(item)
            const { name, ...csvItem } = itemToCsvItem(item)
            return {
              name: `${name} - ${item.amount}`,
              ...csvItem,
            }
          })
        }

        return itemOrItems
          .filter((item) => item !== null)
          .map((item) => itemToCsvItem(item as GenericItem))
      }

      if (itemOrItems.category === 'trait') {
        if (!Array.isArray(itemOrItems)) {
          return {
            name: '',
            category,
            description: '',
            howToGet: '',
            wikiLinks: '',
          }
        }
        return itemOrItems.map((item) => itemToCsvItem(item.item))
      }
    })
    .flat()
}