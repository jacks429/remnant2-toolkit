import { BaseField, BaseLabel } from '@/app/(components)/_base/fieldset'
import {
  BaseListbox,
  BaseListboxLabel,
  BaseListboxOption,
} from '@/app/(components)/_base/listbox'
import {
  ALL_RELEASE_KEYS,
  RELEASE_TO_NAME,
} from '@/app/(data)/releases/constants'
import { ReleaseKey } from '@/app/(data)/releases/types'

interface Props {
  value: string[]
  onChange: (value: string[]) => void
}

export function ReleaseFilter({ value, onChange }: Props) {
  const options = ALL_RELEASE_KEYS.map((release) => ({
    label: RELEASE_TO_NAME[release as ReleaseKey] as string,
    value: release,
  }))
  options.unshift({ label: 'All', value: 'all' })

  return (
    <BaseField>
      <BaseLabel>Releases</BaseLabel>
      <BaseListbox multiple name="release" value={value} onChange={onChange}>
        {options.map(({ label, value }) => (
          <BaseListboxOption key={value} value={value}>
            <BaseListboxLabel>{label}</BaseListboxLabel>
          </BaseListboxOption>
        ))}
      </BaseListbox>
    </BaseField>
  )
}
