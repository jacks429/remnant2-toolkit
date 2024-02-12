import { BuildItems } from '@prisma/client'
import { remnantItems } from '../data/remnantItems'
import { BaseItem } from './BaseItem'
import { Item } from '.'

interface BaseWeaponItem extends BaseItem {
  type: 'long gun' | 'melee' | 'hand gun'
  damage: number
  rps?: number
  magazine?: number
}

export class WeaponItem extends BaseItem implements BaseWeaponItem {
  public category: BaseWeaponItem['category'] = 'weapon'
  public type: BaseWeaponItem['type'] = 'long gun'
  public damage: BaseWeaponItem['damage'] = 0
  public rps?: BaseWeaponItem['rps'] = 0
  public magazine?: BaseWeaponItem['magazine'] = 0

  constructor(props: BaseWeaponItem) {
    super(props)
    this.type = props.type
    this.damage = props.damage
    this.rps = props.rps
    this.magazine = props.magazine
  }

  public static isWeaponItem = (item?: Item): item is WeaponItem => {
    if (!item) return false
    return item.category === 'weapon'
  }

  static toParams(items: Array<WeaponItem | null>): string[] {
    return items.map((i) => `${i?.id ?? ''}`)
  }

  static fromParams(params: string): WeaponItem[] | null {
    const itemIds = params.split(',')
    if (!itemIds) return null

    const items: WeaponItem[] = []
    itemIds.forEach((itemId, index) => {
      const item = remnantItems.find((i) => i.id === itemId)
      if (!item) return
      if (!this.isWeaponItem(item)) return
      items[index] = item
    })

    if (items.length === 0) return null
    if (items.filter((i) => !this.isWeaponItem(i)).length > 0) return null

    return items
  }

  static fromDBValue(buildItems: BuildItems[]): Array<WeaponItem | null> {
    if (!buildItems) return []

    let weaponItems: Array<WeaponItem | null> = []
    for (const buildItem of buildItems) {
      const item = remnantItems.find((i) => i.id === buildItem.itemId)
      if (!item) continue
      if (item.category !== 'weapon') continue
      if (!this.isWeaponItem(item)) continue
      buildItem.index
        ? (weaponItems[buildItem.index] = item)
        : weaponItems.push(item)
    }
    return weaponItems
  }
}
