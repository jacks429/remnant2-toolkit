import { BuildItems } from '@prisma/client'
import { remnantItems } from '../data/remnantItems'
import { GenericItem } from './GenericItem'

export interface BaseModItem extends GenericItem {}

export class ModItem extends GenericItem implements BaseModItem {
  public category: BaseModItem['category'] = 'mod'

  constructor(props: BaseModItem) {
    super(props)
  }

  public static isModItem = (item?: GenericItem): item is ModItem => {
    if (!item) return false
    return item.category === 'mod'
  }

  static toParams(items: Array<ModItem | null>): string[] {
    return items.map((i) => `${i?.id ?? ''}`)
  }

  static fromParams(params: string): ModItem[] | null {
    const itemIds = params.split(',')
    if (!itemIds) return null

    const items: ModItem[] = []
    itemIds.forEach((itemId, index) => {
      const item = remnantItems.find((i) => i.id === itemId)
      if (!item) return
      if (!this.isModItem(item)) return
      items[index] = item
    })

    if (items.length === 0) return null
    if (items.filter((i) => !this.isModItem(i)).length > 0) return null

    return items
  }

  static fromDBValue(buildItems: BuildItems[]): Array<ModItem | null> {
    if (!buildItems) return []

    let modItems: Array<ModItem | null> = []
    for (const buildItem of buildItems) {
      const item = remnantItems.find((i) => i.id === buildItem.itemId)
      if (!item) continue
      if (item.category !== 'mod') continue
      if (!this.isModItem(item)) continue
      buildItem.index ? (modItems[buildItem.index] = item) : modItems.push(item)
    }
    return modItems
  }
}
