import { OrderByFilter } from '@/app/(components)/filters/build-filters/secondary-filters/order-by-filter'
import { OrderBy } from '@/app/(components)/filters/build-filters/secondary-filters/order-by-filter/use-order-by-filter'
import { TimeRangeFilter } from '@/app/(components)/filters/build-filters/secondary-filters/time-range-filter'
import { TimeRange } from '@/app/(components)/filters/build-filters/secondary-filters/time-range-filter/use-time-range-filter'

interface Props {
  orderBy: OrderBy
  onOrderByChange: (orderBy: string) => void
  timeRange: TimeRange
  onTimeRangeChange: (timeRange: string) => void
}

export function BuildSecondaryFilters({
  orderBy,
  timeRange,
  onOrderByChange,
  onTimeRangeChange,
}: Props) {
  return (
    <div className="flex w-full flex-col items-end justify-end gap-x-2 gap-y-1 sm:flex-row sm:gap-y-0">
      <div className="w-full max-w-[250px]">
        <TimeRangeFilter value={timeRange} onChange={onTimeRangeChange} />
      </div>
      <div className="w-full max-w-[250px]">
        <OrderByFilter value={orderBy} onChange={onOrderByChange} />
      </div>
    </div>
  )
}
