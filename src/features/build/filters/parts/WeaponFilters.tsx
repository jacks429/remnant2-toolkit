import { HandGunFilter } from '@/app/(components)/form-fields/selects/hand-gun-filter'
import { LongGunFilter } from '@/app/(components)/form-fields/selects/long-gun-filter'
import { MeleeFilter } from '@/app/(components)/form-fields/selects/melee-filter'

export const DEFAULT_WEAPON_FILTERS = {
  longGun: 'All',
  handGun: 'All',
  melee: 'All',
}

interface Props {
  selectedLongGun: string
  selectedHandGun: string
  selectedMelee: string
  onChange: (weapon: string, type: 'longGun' | 'melee' | 'handGun') => void
}

export function WeaponFilters({
  selectedLongGun,
  selectedHandGun,
  selectedMelee,
  onChange,
}: Props) {
  return (
    <div className="flex w-full flex-col items-start justify-start">
      <div className="grid w-full grid-cols-1 gap-x-8 gap-y-4 text-left sm:grid-cols-3 sm:gap-y-0">
        <LongGunFilter
          value={selectedLongGun}
          onChange={(e) => onChange(e, 'longGun')}
        />
        <MeleeFilter
          value={selectedMelee}
          onChange={(e) => onChange(e, 'melee')}
        />
        <HandGunFilter
          value={selectedHandGun}
          onChange={(e) => onChange(e, 'handGun')}
        />
      </div>
    </div>
  )
}
