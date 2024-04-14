'use client'

import { Disclosure } from '@headlessui/react'
import { FunnelIcon } from '@heroicons/react/24/solid'
import isEqual from 'lodash.isequal'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { BaseButton } from '@/app/(components)/_base/button'
import { Link } from '@/app/(components)/_base/link'
import {
  BaseListbox,
  BaseListboxLabel,
  BaseListboxOption,
} from '@/app/(components)/_base/listbox'
import { parseSearchFilters } from '@/app/world-save-archive/(lib)/parseSearchFilters'
import { BOSS_AFFIXES, BOSSES } from '@/app/world-save-archive/constants'
import {
  BossAffixName,
  BossName,
  SearchFilters,
} from '@/app/world-save-archive/types'
import { Checkbox } from '@/features/ui/Checkbox'
import { FiltersContainer } from '@/features/ui/filters/FiltersContainer'
import { cn } from '@/lib/classnames'

let bossNames = BOSSES.map((b) => b.name as BossName | 'Choose...')
bossNames.unshift('Choose...')

export const defaultBossAffixes = BOSS_AFFIXES.map((affix) => affix.name)

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  affixes: [],
  bossName: 'Choose...',
}

interface Props {}

export function SaveLookupFilters({}: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const filters = parseSearchFilters(searchParams)

  // Tracks the filter changes by the user that are not yet applied
  // via clicking the Apply Filters button
  const [unappliedFilters, setUnappliedFilters] =
    useState<SearchFilters>(filters)

  // This is used to check if the filters are applied
  // This is used to determine if the Apply Filters button should pulsate
  // for the user to indicate they need to apply the changes
  const [areFiltersApplied, setAreFiltersApplied] = useState(
    isEqual(filters, unappliedFilters),
  )

  // If the filters differ from the default filters,
  // the filters table should have a yellow outline to
  // indicate that
  const areAnyFiltersActive = useMemo(() => {
    return (
      filters.affixes.length !== DEFAULT_SEARCH_FILTERS['affixes'].length ||
      filters.bossName !== DEFAULT_SEARCH_FILTERS['bossName']
    )
  }, [filters])

  function handleClearFilters() {
    setUnappliedFilters(DEFAULT_SEARCH_FILTERS)
    handleApplyFilters(DEFAULT_SEARCH_FILTERS)
  }

  function handleApplyFilters(newFilters: SearchFilters) {
    let finalPath = `${pathname}?`
    if (
      newFilters.affixes.length > 0 &&
      newFilters.affixes.length !== defaultBossAffixes.length
    ) {
      finalPath += `affixes=${newFilters.affixes.join(',')}&`
    }
    if (newFilters.bossName !== DEFAULT_SEARCH_FILTERS['bossName']) {
      finalPath += `bossName=${newFilters.bossName}&`
    }

    if (finalPath.endsWith('&')) {
      finalPath = finalPath.slice(0, -1)
    }

    router.push(finalPath, { scroll: false })
  }

  function handleAffixChange(affix: BossAffixName) {
    const newAffixes = unappliedFilters.affixes.includes(affix)
      ? unappliedFilters.affixes.filter((a) => a !== affix)
      : [...unappliedFilters.affixes, affix]

    const newFilters = {
      ...unappliedFilters,
      affixes: newAffixes,
    }
    setUnappliedFilters(newFilters)
    handleApplyFilters(newFilters)
    if (filters.affixes.some((a) => !newAffixes.includes(a))) {
      setAreFiltersApplied(false)
    }
  }

  function handleBossNameChange(bossName: BossName | 'Choose...') {
    const newFilters = {
      ...unappliedFilters,
      bossName,
    }
    setUnappliedFilters(newFilters)
    handleApplyFilters(newFilters)
    if (filters.bossName !== bossName) {
      setAreFiltersApplied(false)
    }
  }

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <div className="mb-4 w-full">
          <div
            className={cn(
              'flex w-full flex-row items-end justify-center gap-x-2 border-b py-2',
              areAnyFiltersActive
                ? 'border-b-accent1-500'
                : 'border-b-primary-500',
            )}
          >
            <div className="flex w-full items-center justify-start">
              <BaseListbox
                key={filters.bossName}
                name="bossName"
                placeholder="Select boss name&hellip;"
                defaultValue={filters.bossName}
                onChange={(e) => {
                  console.info('e', e)
                  handleBossNameChange(e as BossName)
                }}
              >
                {bossNames.map((name) => (
                  <BaseListboxOption key={name} value={name}>
                    <BaseListboxLabel>{name}</BaseListboxLabel>
                  </BaseListboxOption>
                ))}
              </BaseListbox>
            </div>
            <Disclosure.Button as={BaseButton}>
              <FunnelIcon className="h-4 w-4" />
              {open ? 'Hide' : 'Show'}
            </Disclosure.Button>
          </div>
          <Disclosure.Panel className="w-full">
            <FiltersContainer<SearchFilters>
              areFiltersApplied={areFiltersApplied}
              areAnyFiltersActive={areAnyFiltersActive}
              filters={filters}
              onClearFilters={handleClearFilters}
            >
              <div className="col-span-full flex w-full flex-col items-start justify-start gap-x-4 gap-y-2 border-b border-b-primary-800 pb-4 pt-2">
                <div className="flex w-full items-center justify-start text-left text-sm font-bold text-primary-500">
                  By Affix
                </div>
                <div className="text-xs">
                  {/** Not updating this button to new component */}
                  <button
                    className="underline"
                    aria-label="Check all categories"
                    onClick={() => {
                      setUnappliedFilters({
                        ...unappliedFilters,
                        affixes: defaultBossAffixes,
                      })
                      handleApplyFilters({
                        ...unappliedFilters,
                        affixes: defaultBossAffixes,
                      })
                    }}
                  >
                    Check All
                  </button>{' '}
                  / {/** Not updating this button to new component */}
                  <button
                    className="underline"
                    aria-label="Uncheck all categories"
                    onClick={() => {
                      setUnappliedFilters({ ...unappliedFilters, affixes: [] })
                      handleApplyFilters({ ...unappliedFilters, affixes: [] })
                    }}
                  >
                    Uncheck All
                  </button>
                </div>
                <div className="relative flex w-full flex-col items-start shadow-sm">
                  <div className="grid w-full grid-cols-2 text-left sm:grid-cols-3">
                    {BOSS_AFFIXES.map((affix) => (
                      <div
                        key={affix.name}
                        id={affix.name}
                        className="col-span-1"
                      >
                        <Checkbox
                          label={affix.name}
                          name={`affix-${affix.name}`}
                          checked={unappliedFilters.affixes.includes(
                            affix.name,
                          )}
                          onChange={() => handleAffixChange(affix.name)}
                        />
                      </div>
                    ))}
                  </div>
                  <Link
                    href="https://remnant.wiki/Affix"
                    target="_blank"
                    className="mt-4 text-xs text-gray-300 underline hover:text-white"
                  >
                    For more detailed affix information, visit the Remnant Wiki
                  </Link>
                </div>
              </div>
            </FiltersContainer>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
