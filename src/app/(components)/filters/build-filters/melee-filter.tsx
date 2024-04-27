import { BaseField, BaseLabel } from '@/app/(components)/_base/fieldset'
import {
  BaseListbox,
  BaseListboxLabel,
  BaseListboxOption,
} from '@/app/(components)/_base/listbox'
import { weaponItems } from '@/app/(data)/items/weapon-items'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function MeleeFilter({ value, onChange }: Props) {
  const allMelee: string[] = weaponItems
    .filter((item) => item.type === 'melee')
    .map((item) => item.name)
  allMelee.unshift('All')

  const options = allMelee.map((weapon) => ({
    label: weapon,
    value: weapon,
  }))

  return (
    <BaseField>
      <BaseLabel>Melee</BaseLabel>
      <BaseListbox
        key={value as string}
        name="melee"
        value={value}
        onChange={onChange}
      >
        {options.map(({ label, value }) => (
          <BaseListboxOption key={value} value={value}>
            <BaseListboxLabel>{label}</BaseListboxLabel>
          </BaseListboxOption>
        ))}
      </BaseListbox>
    </BaseField>
  )
}
