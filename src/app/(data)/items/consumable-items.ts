import { ConsumableItem } from './types/ConsumableItem'

export const consumableItems: ConsumableItem[] = [
  {
    category: 'consumable',
    name: 'All-Seeing Eye',
    imagePath: '/consumable/all_seeing_eye.png',
    id: 'rw5Q9E',
    dlc: 'base',
    tags: [
      'Health',
      'Stamina',
      'Reduce Skill Cooldown',
      'Mod Power',
      'All Damage',
    ],
    description: `Grants a random buff or debuff. Lasts 3m.`,
    wikiLinks: [`https://remnant.wiki/All-Seeing_Eye`],
  },
  {
    category: 'consumable',
    name: 'Ambit Ember',
    imagePath: '/consumable/ambit_ember.png',
    saveFileSlug: 'consumable_spice',
    id: '6lnae6',
    dlc: 'base',
    tags: ['Perfect Dodge', 'Neutral Dodge', 'Perfect Neutral Evade'],
    description: `Slightly increases Evade Window and Evade Speed by 15%. Lasts 60s.`,
    wikiLinks: [`https://remnant.wiki/Ambit_Ember`],
  },
  {
    category: 'consumable',
    name: 'Ammo Box',
    imagePath: '/consumable/ammo_box.png',
    id: 'v2usqs',
    dlc: 'base',
    tags: ['Ammo Reserves'],
    description: `Replenishes all reserve ammo.`,
    wikiLinks: [`https://remnant.wiki/Ammo_Box`],
  },
  {
    category: 'consumable',
    name: 'Antidote',
    imagePath: '/consumable/antidote.png',
    id: 'a34kjc',
    dlc: 'base',
    tags: ['Damage Reduction'],
    description: `Removes CORRODED effect and increases ACID resistance by 15%. Lasts 10m.`,
    wikiLinks: [`https://remnant.wiki/Antidote`],
  },
  {
    category: 'consumable',
    name: 'Bandage',
    imagePath: '/consumable/bandage.png',
    id: 'elazod',
    dlc: 'base',
    tags: ['Grey Health', 'Heal'],
    description: `Stops BLEEDING and restores all Grey Health.`,
    wikiLinks: [`https://remnant.wiki/Bandage`],
  },
  {
    category: 'consumable',
    name: 'Binding Orb',
    imagePath: '/consumable/binding_orb.png',
    id: 'edaeta',
    dlc: 'base',
    tags: ['Grenade', 'Status Effect'],
    description: `When thrown, device becomes an anchor and applies SLOW to all enemies within 4m. [A] Lasts 20s.`,
    wikiLinks: [`https://remnant.wiki/Binding_Orb`],
  },
  {
    category: 'consumable',
    name: 'Black Tar',
    imagePath: '/consumable/black_tar.png',
    tags: ['Grenade'],
    id: 'nrdcko',
    dlc: 'base',
    description: `When thrown, explodes in a 4m radius dealing 30 damage [E] and creating a puddle lasting 15s which applies TARRED for 30s to creatures inside.

    Ranged damage and other FIRE sources ignite TARRED entities, dealing 250 BURNING damage over 10s.`,
    wikiLinks: [`https://remnant.wiki/Black_Tar`],
  },
  {
    category: 'consumable',
    name: 'Blood Root',
    imagePath: '/consumable/blood_root.png',
    id: 'bisl2l',
    dlc: 'base',
    tags: ['Heal'],
    description: `Regenerates 1.5 Health per second. Lasts 30s.`,
    wikiLinks: [`https://remnant.wiki/Blood_Root`],
  },
  {
    category: 'consumable',
    name: 'Brightstone',
    imagePath: '/consumable/brightstone.png',
    id: '937h03',
    dlc: 'base',
    tags: ['Grenade'],
    description: `When thrown, explodes in a 4m [A] radius dealing 50 damage and leaving a mysterious Mist which causes enemies to receive 10% additional damage. Debuff last 10s after enemies leave the Mist. Lasts 15s.`,
    wikiLinks: [`https://remnant.wiki/Brightstone`],
  },
  {
    category: 'consumable',
    name: 'Confidence Booster',
    imagePath: '/consumable/confidence_booster.png',
    id: 'al8yob',
    dlc: 'base',
    tags: ['Damage Reduction', 'Stagger'],
    description: `Reduces incoming damage by 10% and Stagger by 1. Lasts 20s.`,
    wikiLinks: [`https://remnant.wiki/Confidence_Booster`],
  },
  {
    category: 'consumable',
    name: 'Dried Fruit',
    imagePath: '/consumable/dried_fruit.png',
    id: 'Y8ey65',
    dlc: 'base',
    tags: ['Heal'],
    description: `Regenerates 5% Health instantly.`,
    wikiLinks: [`https://remnant.wiki/Dried_Fruit`],
  },
  {
    category: 'consumable',
    name: 'Ethereal Orb',
    imagePath: '/consumable/ethereal_orb.png',
    id: 'ffjbc9',
    dlc: 'base',
    tags: ['Damage Reduction'],
    description: `Removes OVERLOADED effect and increases SHOCK resistance by 15%. Lasts 10m.`,
    wikiLinks: [`https://remnant.wiki/Ethereal_Orb`],
  },
  {
    category: 'consumable',
    name: 'Faerie Needle',
    imagePath: '/consumable/faerie_needle.png',
    id: 'aqphr5',
    dlc: 'base',
    tags: ['Mod Power'],
    description: `Regenerates 10 Mod Power per second. Lasts 60s.`,
    wikiLinks: [`https://remnant.wiki/Faerie_Needle`],
  },
  {
    category: 'consumable',
    name: 'Gul Serum',
    imagePath: '/consumable/gul_serum.png',
    id: 'm1gznf',
    dlc: 'base',
    tags: ['Stamina'],
    description: `Reduces Stamina Consumption by 50%. Lasts 60s.`,
    wikiLinks: [`https://remnant.wiki/Gul_Serum`],
  },
  {
    category: 'consumable',
    name: 'Koara Pellet',
    imagePath: '/consumable/koara_pellet.png',
    id: '1585ah',
    dlc: 'base',
    tags: ['Heal'],
    description: `Consume to restore 10% Max Health instantly.`,
    wikiLinks: [`https://remnant.wiki/Koara_Pellet`],
  },
  // * Removed due to not having a purpose in the toolkit
  // {
  //   category: 'consumable',
  //   name: 'Liquid Escape',
  //   imagePath: '/consumable/liquid_escape.png',
  //   id: 'xgdk68',
  //   description: `When consumed, the hero will be returned to the last activated checkpoint.`,
  //   wikiLinks: [`https://remnant.wiki/Liquid_Escape`],
  // },
  {
    category: 'consumable',
    name: 'Mud Rub',
    imagePath: '/consumable/mud_rub.png',
    id: 'dvx5ib',
    dlc: 'base',
    tags: ['Damage Reduction'],
    description: `Extinguishes BURNING effect and increases FIRE resistance by 15. Lasts 10m.`,
    wikiLinks: [`https://remnant.wiki/Mud_Rub`],
  },
  {
    category: 'consumable',
    name: 'Mystery Jerky',
    imagePath: '/consumable/mystery_jerky1.png',
    id: '6aasor',
    dlc: 'base',
    tags: ['Grey Health'],
    description: `Converts 6.66 Health into Grey Health per second. Lasts 15s.`,
    wikiLinks: [`https://remnant.wiki/Mystery_Jerky`],
  },
  {
    category: 'consumable',
    name: 'Oilskin Balm',
    imagePath: '/consumable/oilskin_balm.png',
    id: '0sec3n',
    dlc: 'base',
    tags: ['Damage Reduction'],
    description: `Cures ROOT ROT Blight and increases Blight Resistance by 25%. Lasts 10m.`,
    wikiLinks: [`https://remnant.wiki/Oilskin_Balm`],
  },
  // * No longer useful in the builder
  // {
  //   category: 'consumable',
  //   name: 'Orb of Undoing',
  //   imagePath: '/consumable/orb_of_undoing.png',
  //   id: 'g0s7fg',
  //   description: `Resets all spent trait points. Can be used infinitely.`,
  //   wikiLinks: [`https://remnant.wiki/Orb_of_Undoing`],
  // },
  {
    category: 'consumable',
    name: 'Pipe Bomb',
    imagePath: '/consumable/pipe_bomb.png',
    id: 'kfwizc',
    dlc: 'base',
    tags: ['Grenade'],
    description: `When thrown, explodes in a 4m [A] radius dealing 150 damage [E] and applying BLEEDING, which deals an additional 250 BLEED damage over 30s.`,
    wikiLinks: [`https://remnant.wiki/Pipe_Bomb`],
  },
  {
    category: 'consumable',
    name: 'Poisoned Ambit Ember Capsule',
    imagePath: '/consumable/poisoned_ambit_ember_capsule.png',
    saveFileSlug: 'poisonedspice',
    id: '6awni8',
    dlc: 'base',
    description: `
    Use to equip the capsule which can be thrown by pressing FIRE. The capsule will detonate after 2s or upon hitting an enemy, releasing a chemical agent which dampens the psionic abilities of long-term Ambit Ember users.`,
    wikiLinks: [`https://remnant.wiki/Poisoned_Ambit_Ember_Capsule`],
  },
  {
    category: 'consumable',
    name: 'Processed Koara',
    imagePath: '/consumable/processed_koara.png',
    id: '4lvdgg',
    dlc: 'base',
    tags: ['Stamina'],
    description: `Decreases Stamina Recovery delay by 75% and Stamina Regen Penalty by 50%. Lasts 60s.`,
    wikiLinks: [`https://remnant.wiki/Processed_Koara`],
  },
  {
    category: 'consumable',
    name: 'Purified Salve',
    imagePath: '/consumable/purified_salve.png',
    id: 'wzi8il',
    dlc: 'base',
    tags: ['Damage Reduction'],
    description: `Cures CURSE and increases Blight Resistance by 25%. Lasts 10m.`,
    wikiLinks: [`https://remnant.wiki/Purified_Salve`],
  },
  {
    category: 'consumable',
    name: 'Rocket Fuel',
    imagePath: '/consumable/rocket_fuel.png',
    id: 'rlpblq',
    dlc: 'base',
    tags: ['Fire Rate', 'Melee Attack Speed'],
    description: `Increases Fire Rate by 10% and Melee Attack Speed by 15%. Lasts 20s.`,
    wikiLinks: [`https://remnant.wiki/Rocket_Fuel`],
  },
  {
    category: 'consumable',
    name: 'Sweet Leaf',
    imagePath: '/consumable/sweet_leaf.png',
    id: 'rlpblz',
    dlc: 'dlc2',
    tags: ['Damage Reduction'],
    description: `Grants 1 stack of BULWARK. Lasts 30s.`,
    wikiLinks: [`https://remnant.wiki/Sweet_Leaf`],
  },
  {
    category: 'consumable',
    name: 'Timeworn Unguent',
    imagePath: '/consumable/timeworn_unguent.png',
    id: 'li99wc',
    dlc: 'base',
    tags: ['Damage Reduction'],
    description: `Cures SUPPRESSION Blight and increases Blight Resistance by 25%. Lasts 10m.`,
    wikiLinks: [`https://remnant.wiki/Timeworn_Unguent`],
  },
  // This item appears to not be in the game
  // {
  //   category: 'consumable',
  //   name: 'Vigor Leaf',
  //   imagePath: '/consumable/vigor_leaf.png',
  //   id: 'jgp8cg',
  //   description: `Decreases Stamina Recovery delay by 20% and Stamina Regen Penalty by 15%. Last 60s.`,
  //     //   wikiLinks: [`https://remnant.wiki/Vigor_Leaf`],
  // },
]
