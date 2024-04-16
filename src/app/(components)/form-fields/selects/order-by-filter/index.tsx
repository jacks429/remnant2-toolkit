import {
  BaseListbox,
  BaseListboxLabel,
  BaseListboxOption,
} from '@/app/(components)/_base/listbox'
import { useOrderByFilter } from '@/app/(components)/form-fields/filters/order-by-filter/use-order-by-filter'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function OrderByFilter({ value, onChange }: Props) {
  const { orderByOptions, handleOrderByChange } = useOrderByFilter()

  return (
    <BaseListbox key={value} name="orderBy" value={value} onChange={onChange}>
      {orderByOptions.map(({ label, value }) => (
        <BaseListboxOption key={value} value={value}>
          <BaseListboxLabel>{label}</BaseListboxLabel>
        </BaseListboxOption>
      ))}
    </BaseListbox>
  )
}
