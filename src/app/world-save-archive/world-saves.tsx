'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BaseButton } from '@/app/(components)/_base/button'
import { WorldSaveCard } from '@/app/(components)/cards/world-save-card'
import {
  DEFAULT_FILTER,
  FilteredWorldSave,
  WorldSaveFilters,
} from '@/app/(components)/filters/world-save-filters/types'
import { parseUrlFilters } from '@/app/(components)/filters/world-save-filters/utils'
import { ALL_BOSSES } from '@/app/(data)/world-saves/constants'
import { worldSaves } from '@/app/(data)/world-saves/world-saves'

function getFilteredSaves(filters: WorldSaveFilters): FilteredWorldSave[] {
  let filteredSaves: FilteredWorldSave[] = worldSaves.map((s) => {
    const bossItem = ALL_BOSSES.find((b) => b.name === s.bossName)
    return {
      ...s,
      imagePath: bossItem?.imagePath || '',
    }
  })

  // If boss name is not default, filter by boss name
  if (filters.bossName !== DEFAULT_FILTER) {
    filteredSaves = filteredSaves.filter((s) => s.bossName === filters.bossName)
  }

  // if boss affixes are not default, filter by boss affixes
  if (
    filters.bossAffixes.length > 0 &&
    !filters.bossAffixes.some((a) => a === DEFAULT_FILTER)
  ) {
    // Need to only get saves that have at least two of the affixes
    // If only one affix is in the filters.affixes, show all saves that have that affix
    filteredSaves = filteredSaves.filter((save) => {
      const matchingAffixes = save.bossAffixes.filter((affix) =>
        filters.bossAffixes
          .filter((affix) => affix !== DEFAULT_FILTER)
          .includes(affix),
      )

      if (filters.bossAffixes.length === 1) {
        return matchingAffixes.length > 0
      } else {
        return matchingAffixes.length >= 2
      }
    })
  }

  // if releases are not default, filter by releases
  if (
    filters.releases.length > 0 &&
    !filters.releases.some((r) => r === DEFAULT_FILTER)
  ) {
    filteredSaves = filteredSaves.filter((save) =>
      filters.releases
        .filter((release) => release !== DEFAULT_FILTER)
        .includes(save.release),
    )
  }

  return filteredSaves
}

interface Props {}

export function WorldSaves({}: Props) {
  const [showAll, setShowAll] = useState(false)

  const searchParams = useSearchParams()
  const [filters, setFilters] = useState(parseUrlFilters(searchParams))

  useEffect(() => {
    setFilters(parseUrlFilters(searchParams))
  }, [searchParams])

  let filteredSaves = getFilteredSaves(filters)

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-auto p-4">
      {filteredSaves.length === worldSaves.length && (
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h2 className="text-center text-2xl font-bold text-primary-500">
            Apply a filter to search the {worldSaves.length} world saves
          </h2>
          {!showAll && (
            <BaseButton onClick={() => setShowAll(true)}>Show All</BaseButton>
          )}
        </div>
      )}
      {filteredSaves.length === 0 && (
        <h2 className="text-center text-2xl font-bold text-primary-500">
          No items found
        </h2>
      )}

      {filteredSaves.length > 0 &&
        filteredSaves.length !== worldSaves.length && (
          <h2 className="my-4 text-2xl font-bold text-primary-500">
            World Saves ({filteredSaves.length} Results)
          </h2>
        )}

      {filteredSaves.length !== worldSaves.length || showAll ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredSaves.map((save) => (
            <WorldSaveCard
              key={`${save.bossName}-${save.bossAffixes.join(',')}`}
              saveItem={save}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
