import { AmuletFilter } from '@/app/(components)/form-fields/selects/amulet-filter'
import { RingFilter } from '@/app/(components)/form-fields/selects/ring-filter'

export const DEFAULT_JEWELRY_FILTERS = {
  amulet: 'All',
  ring: 'All',
}

interface Props {
  selectedRings: {
    ring1: string
    ring2: string
    ring3: string
    ring4: string
  }
  selectedAmulet: string
  onChangeRing: (ring: string, slot: number) => void
  onChangeAmulet: (amulet: string) => void
}

export function JewelryFilters({
  selectedRings,
  selectedAmulet,
  onChangeRing,
  onChangeAmulet,
}: Props) {
  return (
    <div className="flex w-full flex-col items-start justify-start">
      <div className="grid w-full grid-cols-1 gap-x-8 gap-y-4 text-left sm:grid-cols-3 sm:gap-y-0">
        <div className="col-span-full sm:col-span-1">
          <AmuletFilter value={selectedAmulet} onChange={onChangeAmulet} />
        </div>
        <div className="col-span-full grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2">
          <RingFilter
            value={selectedRings.ring1}
            onChange={(ring) => onChangeRing(ring, 1)}
          />
          <RingFilter
            value={selectedRings.ring2}
            onChange={(ring) => onChangeRing(ring, 2)}
          />
          <RingFilter
            value={selectedRings.ring3}
            onChange={(ring) => onChangeRing(ring, 3)}
          />
          <RingFilter
            value={selectedRings.ring4}
            onChange={(ring) => onChangeRing(ring, 4)}
          />
        </div>
      </div>
    </div>
  )
}
