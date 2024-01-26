import { Fragment, useCallback, useMemo, useState } from 'react'
import { cn } from '@/lib/classnames'
import BuilderName from './BuilderName'
import BuilderButton from './BuilderButton'
import Traits from './Traits'
import ItemSelect from './ItemSelect'
import Logo from '@/features/ui/Logo'
import MemberFeatures from './MemberFeatures'
import {
  getArrayOfLength,
  getConcoctionSlotCount,
  getItemListForSlot,
} from '../lib'
import { BuildState } from '@/features/build/types'
import PopularBuildBadge from '@/features/build/components/PopularBuildBadge'
import Stats from './Stats'
import Link from 'next/link'
import { DEFAULT_TRAIT_AMOUNT, POPULAR_VOTE_THRESHOLD } from '../constants'
import { GenericItem } from '@/features/items/types/GenericItem'
import { Item } from '@/features/items/types'
import { TraitItem } from '@/features/items/types/TraitItem'
import ItemInfo from '@/features/items/components/ItemInfo'

type BuilderProps = {
  buildState: BuildState
  includeMemberFeatures: boolean
  isScreenshotMode: boolean
  showControls: boolean
  showCreatedBy?: boolean
} & (
  | { isEditable: false; onUpdateBuildState?: never }
  | {
      isEditable: true
      onUpdateBuildState: ({
        category,
        value,
        scroll,
      }: {
        category: string
        value: string | Array<string | undefined>
        scroll?: boolean
      }) => void
    }
)

export default function Builder({
  buildState,
  includeMemberFeatures,
  isEditable,
  isScreenshotMode,
  showControls,
  showCreatedBy = true,
  onUpdateBuildState,
}: BuilderProps) {
  const concoctionSlotCount = getConcoctionSlotCount(buildState)
  const isPopular = buildState.totalUpvotes > POPULAR_VOTE_THRESHOLD

  // Tracks information about the slot the user is selecting an item for
  const [selectedItemSlot, setSelectedItemSlot] = useState<{
    category: GenericItem['category'] | null
    index?: number
  }>({
    category: null,
  })

  /** If the item category is null, modal is closed */
  const isItemSelectModalOpen = Boolean(selectedItemSlot.category)

  //Tracks whether the build name is editable or not.
  const [isEditingBuildName, setIsEditingBuildName] = useState(false)

  // Tracks the item that the user is viewing information for
  const [infoItem, setInfoItem] = useState<Item | null>(null)

  /**
   * Returns a list of items that match the selected slot
   * This is passed to the ItemSelect modal to display the correct items
   */
  const itemListForSlot = useMemo(
    () => getItemListForSlot(buildState, selectedItemSlot),
    [selectedItemSlot, buildState],
  )

  /**
   * Fires when the user changes an item in the build.
   *
   * If the item is null, the item is removed from the build
   * and from the query string.
   *
   * If the item is not null, the item is added to the build
   * and the query string is updated.
   */
  const handleSelectItem = useCallback(
    (selectedItem: GenericItem | null) => {
      if (!selectedItemSlot.category) return
      if (!onUpdateBuildState) return

      /**
       * The item index is used to determine which item in the array of items
       * for slots like rings and archtypes
       */
      const specifiedIndex = selectedItemSlot.index
      const isIndexSpecified = specifiedIndex !== undefined

      // If the item is null, remove the item from the build
      // and from the query string
      // If the item can be multiple, such as rings,
      // then remove the item at the specified index
      if (!selectedItem) {
        if (isIndexSpecified) {
          const buildItems = buildState.items[selectedItemSlot.category]

          if (!Array.isArray(buildItems)) return

          // We can't filter here because we want to preserve the index
          // If we filtered, the second archtype would become the first archtype
          // if you removed the first archtype
          const newBuildItems = buildItems.map((item, index) =>
            index === specifiedIndex ? null : item,
          )
          const newItemIds = newBuildItems.map((i) => i?.id ?? '')
          onUpdateBuildState({
            category: selectedItemSlot.category,
            value: newItemIds,
          })
        } else {
          onUpdateBuildState({ category: selectedItemSlot.category, value: '' })
        }

        setSelectedItemSlot({ category: null })
        return
      }

      const categoryItemOrItems = buildState.items[selectedItemSlot.category]

      // If the item can be multiple, such as rings,
      // then add the item at the specified index
      if (Array.isArray(categoryItemOrItems)) {
        const buildItems = categoryItemOrItems

        const itemAlreadyInBuild = buildItems.find(
          (i) => i?.id === selectedItem.id,
        )
        if (itemAlreadyInBuild) return

        /** Used to add the new item to the array of items for this slot */
        const newBuildItems = [...buildItems]

        const specifiedIndex = selectedItemSlot.index
        const isIndexSpecified = specifiedIndex !== undefined

        isIndexSpecified
          ? (newBuildItems[specifiedIndex] = selectedItem)
          : newBuildItems.push(selectedItem)

        // If the item is a trait, then we need to add the amount to the query string
        if (selectedItemSlot.category === 'trait') {
          const newTraitItemParams = TraitItem.toParams(
            newBuildItems as TraitItem[],
          )
          onUpdateBuildState({ category: 'trait', value: newTraitItemParams })
          setSelectedItemSlot({ category: null })
          return
        }

        // If we got here, add the item to the build
        const newItemIds = newBuildItems.map((i) => i?.id)
        onUpdateBuildState({
          category: selectedItem.category,
          value: newItemIds,
        })
        setSelectedItemSlot({ category: null })
        return
      }

      // If the item is not null, add the item to the build
      const buildItem = categoryItemOrItems

      const itemAlreadyInBuild = buildItem?.id === selectedItem.id
      if (itemAlreadyInBuild) return

      onUpdateBuildState({
        category: selectedItem.category,
        value: selectedItem.id,
      })
      setSelectedItemSlot({ category: null })
    },
    [
      buildState.items,
      selectedItemSlot.category,
      selectedItemSlot.index,
      onUpdateBuildState,
    ],
  )

  function handleChangeDescription(description: string) {
    if (!isEditable) return
    if (!onUpdateBuildState) return
    onUpdateBuildState({ category: 'description', value: description })
  }

  function handleToggleIsPublic(isPublic: boolean) {
    if (!isEditable) return
    if (!onUpdateBuildState) return
    onUpdateBuildState({
      category: 'isPublic',
      value: isPublic ? 'true' : 'false',
    })
  }

  function handleShowInfo(item: Item) {
    setInfoItem(item)
  }

  function handleButtonClick(
    category: GenericItem['category'],
    index?: number,
  ) {
    if (!isEditable) return
    setSelectedItemSlot({ category, index })
  }

  function handleUpdateBuildName(newBuildName: string) {
    if (!isEditable) return
    if (!onUpdateBuildState) return
    onUpdateBuildState({ category: 'name', value: newBuildName })
    setIsEditingBuildName(false)
  }

  function handleRemoveTrait(traitItem: TraitItem) {
    if (!isEditable) return
    if (!onUpdateBuildState) return

    const newTraitItems = buildState.items.trait.filter(
      (i) => i.name !== traitItem.name,
    )
    const newTraitItemParams = TraitItem.toParams(newTraitItems)
    onUpdateBuildState({ category: 'trait', value: newTraitItemParams })
  }

  function handleUpdateTraitAmount(newTraitItem: TraitItem) {
    if (!isEditable) return
    if (!onUpdateBuildState) return

    const newTraitItems = buildState.items.trait.map((traitItem) => {
      if (traitItem.name === newTraitItem.name) {
        return newTraitItem
      }
      return traitItem
    })

    // validate the amounts
    const validatedTraitItems = newTraitItems.map((traitItem) => {
      let validAmount = traitItem.amount

      // if this is the linked trait to an archtype,
      // the default should be the linked amount
      let defaultAmount = DEFAULT_TRAIT_AMOUNT

      // if this is the linked trait for the primary archtype,
      // make sure the amount is not less than the minimum allowed
      if (buildState.items.archtype[0]?.name) {
        const linkedTrait =
          buildState.items.archtype[0]?.linkedItems?.traits?.find(
            (linkedTrait) => linkedTrait.name === traitItem.name,
          )
        if (linkedTrait && traitItem.name === linkedTrait.name) {
          if (validAmount < linkedTrait.amount) {
            validAmount = linkedTrait.amount
            defaultAmount = linkedTrait.amount
          }
        }
      } else if (buildState.items.archtype[1]?.name) {
        const linkedTrait =
          buildState.items.archtype[1]?.linkedItems?.traits?.find(
            (linkedTrait) => linkedTrait.name === traitItem.name,
          )
        if (linkedTrait && traitItem.name === linkedTrait.name) {
          if (validAmount > linkedTrait.amount) {
            validAmount = linkedTrait.amount
            defaultAmount = linkedTrait.amount
          }
        }
      }

      if (isNaN(validAmount)) validAmount = defaultAmount
      if (validAmount < 1) validAmount = defaultAmount
      if (validAmount > 10) validAmount = defaultAmount

      return { ...traitItem, amount: validAmount }
    })

    const newTraitItemParams = TraitItem.toParams(validatedTraitItems)
    onUpdateBuildState({ category: 'trait', value: newTraitItemParams })
  }

  return (
    <div
      className={cn(
        'w-full grow rounded border-2 bg-black p-4',
        !buildState.isMember && 'border-green-500',
        buildState.isMember &&
          !isScreenshotMode &&
          'border-yellow-300 shadow-lg shadow-yellow-600',
        buildState.isMember && isScreenshotMode && 'border-yellow-500',
      )}
    >
      <ItemSelect
        open={isItemSelectModalOpen}
        onClose={() => setSelectedItemSlot({ category: null })}
        onSelectItem={handleSelectItem}
        itemList={itemListForSlot}
        buildSlot={selectedItemSlot.category}
      />

      <ItemInfo
        item={infoItem}
        open={Boolean(infoItem)}
        onClose={() => setInfoItem(null)}
      />

      <div className={cn('relative mb-4 border-b border-b-green-900')}>
        <BuilderName
          isEditable={isEditable}
          isEditingBuildName={isEditingBuildName}
          onClick={() => setIsEditingBuildName(true)}
          onClose={(newBuildName: string) =>
            handleUpdateBuildName(newBuildName)
          }
          name={buildState.name}
          showControls={showControls}
        />
        {showCreatedBy && (
          <p className="mb-2 flex items-center justify-center text-sm text-gray-400">
            Build by{' '}
            <Link
              href={`/profile/${buildState.createdById}`}
              className="ml-1 text-green-500 underline hover:text-green-700"
            >
              {buildState.createdByDisplayName}
            </Link>
          </p>
        )}
        {isPopular && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform">
            <PopularBuildBadge />
          </div>
        )}
      </div>

      <div>
        <div
          id="archtype-container"
          className={cn(
            'flex flex-row flex-wrap items-start justify-between gap-1 sm:justify-center',
            isScreenshotMode && 'justify-center gap-2',
          )}
        >
          {getArrayOfLength(2).map((archtypeIndex) => (
            <Fragment key={`archtype-${archtypeIndex}`}>
              <BuilderButton
                item={buildState.items.archtype[archtypeIndex]}
                isEditable={isEditable}
                onClick={() => handleButtonClick('archtype', archtypeIndex)}
                onItemInfoClick={handleShowInfo}
                isScreenshotMode={isScreenshotMode}
              />
              <BuilderButton
                item={buildState.items.skill[archtypeIndex]}
                isEditable={isEditable}
                onClick={() => handleButtonClick('skill', archtypeIndex)}
                onItemInfoClick={handleShowInfo}
                isScreenshotMode={isScreenshotMode}
              />
            </Fragment>
          ))}
        </div>
        <div
          className={cn(
            'relative flex w-full items-start justify-between gap-4',
          )}
        >
          {isScreenshotMode && (
            <div className="absolute bottom-[10px] right-[80px]">
              <Logo showUrl />
            </div>
          )}
          <div id="left-column" className="flex-none">
            <BuilderButton
              item={buildState.items.helm}
              isEditable={isEditable}
              onClick={() => handleButtonClick('helm')}
              onItemInfoClick={handleShowInfo}
              isScreenshotMode={isScreenshotMode}
            />
            <BuilderButton
              item={buildState.items.torso}
              isEditable={isEditable}
              onClick={() => handleButtonClick('torso')}
              onItemInfoClick={handleShowInfo}
              isScreenshotMode={isScreenshotMode}
            />
            <BuilderButton
              item={buildState.items.legs}
              isEditable={isEditable}
              onClick={() => handleButtonClick('legs')}
              onItemInfoClick={handleShowInfo}
              isScreenshotMode={isScreenshotMode}
            />
            <BuilderButton
              item={buildState.items.gloves}
              isEditable={isEditable}
              onClick={() => handleButtonClick('gloves')}
              onItemInfoClick={handleShowInfo}
              isScreenshotMode={isScreenshotMode}
            />
            <div
              id="relic-container"
              className="relative flex items-start justify-start"
            >
              <BuilderButton
                item={buildState.items.relic}
                isEditable={isEditable}
                onClick={() => handleButtonClick('relic')}
                onItemInfoClick={handleShowInfo}
                isScreenshotMode={isScreenshotMode}
              />
              <div
                id="relic-fragment-container"
                className="absolute left-[66px] top-0 flex w-[160px] flex-col items-start justify-start"
              >
                <BuilderButton
                  isEditable={isEditable}
                  size="sm"
                  item={buildState.items.relicfragment[0]}
                  onClick={() => handleButtonClick('relicfragment', 0)}
                  onItemInfoClick={handleShowInfo}
                  isScreenshotMode={isScreenshotMode}
                />
                <BuilderButton
                  item={buildState.items.relicfragment[1]}
                  isEditable={isEditable}
                  size="sm"
                  onClick={() => handleButtonClick('relicfragment', 1)}
                  onItemInfoClick={handleShowInfo}
                  isScreenshotMode={isScreenshotMode}
                />
                <BuilderButton
                  item={buildState.items.relicfragment[2]}
                  isEditable={isEditable}
                  size="sm"
                  onClick={() => handleButtonClick('relicfragment', 2)}
                  onItemInfoClick={handleShowInfo}
                  isScreenshotMode={isScreenshotMode}
                />
              </div>
            </div>
          </div>
          <div
            id="center-column"
            className="relative ml-[13px] flex h-[450px] max-h-[450px] w-full flex-col items-start justify-start overflow-y-auto sm:h-[460px] sm:max-h-[460px]"
          >
            <Stats
              buildState={buildState}
              isScreenshotMode={isScreenshotMode}
            />
          </div>
          <div id="right-column" className="flex-none">
            <BuilderButton
              item={buildState.items.amulet}
              isEditable={isEditable}
              onClick={() => handleButtonClick('amulet')}
              onItemInfoClick={handleShowInfo}
              isScreenshotMode={isScreenshotMode}
            />
            {getArrayOfLength(4).map((ringIndex) => (
              <BuilderButton
                key={`ring-${ringIndex}`}
                item={buildState.items.ring[ringIndex]}
                isEditable={isEditable}
                onClick={() => handleButtonClick('ring', ringIndex)}
                onItemInfoClick={handleShowInfo}
                isScreenshotMode={isScreenshotMode}
              />
            ))}
          </div>
        </div>

        <div
          id="guns-row"
          className="flex w-full flex-row items-start justify-start gap-2 overflow-x-auto"
        >
          {getArrayOfLength(3).map((weaponIndex) => (
            <div
              key={`gun-${weaponIndex}`}
              className="flex flex-col items-start justify-center"
            >
              <BuilderButton
                item={buildState.items.weapon[weaponIndex]}
                size="wide"
                isEditable={isEditable}
                onClick={() => handleButtonClick('weapon', weaponIndex)}
                onItemInfoClick={handleShowInfo}
                isScreenshotMode={isScreenshotMode}
              />
              <div className="flex w-full grow items-start justify-around gap-4">
                {weaponIndex !== 1 || buildState.items.mod[weaponIndex] ? (
                  <BuilderButton
                    item={buildState.items.mod[weaponIndex]}
                    size="md"
                    isEditable={isEditable}
                    onClick={
                      weaponIndex === 1
                        ? undefined
                        : () => handleButtonClick('mod', weaponIndex)
                    }
                    onItemInfoClick={handleShowInfo}
                    isScreenshotMode={isScreenshotMode}
                  />
                ) : (
                  <div className="h-[66px] w-[66px]" />
                )}
                <BuilderButton
                  item={buildState.items.mutator[weaponIndex]}
                  size="md"
                  isEditable={isEditable}
                  onClick={() => handleButtonClick('mutator', weaponIndex)}
                  onItemInfoClick={handleShowInfo}
                  isScreenshotMode={isScreenshotMode}
                />
              </div>
            </div>
          ))}
        </div>
        <div id="trait-row" className="mt-4 w-full">
          <Traits
            buildState={buildState}
            showControls={showControls}
            isEditable={isEditable}
            isScreenshotMode={isScreenshotMode}
            onAddTrait={() => handleButtonClick('trait')}
            onRemoveTrait={(traitItem) => handleRemoveTrait(traitItem)}
            onUpdateAmount={(newTraitItem) =>
              handleUpdateTraitAmount(newTraitItem)
            }
          />
        </div>

        {buildState.items.concoction.every((i) => !i) && !isEditable ? null : (
          <div
            id="concoction-container"
            className={cn(
              'mt-4 flex flex-row flex-wrap items-start justify-between gap-x-2 gap-y-0 sm:justify-start',
              isScreenshotMode && 'justify-start',
            )}
          >
            <BuilderButton
              item={buildState.items.concoction[0]}
              isEditable={isEditable}
              onClick={() => handleButtonClick('concoction', 0)}
              onItemInfoClick={handleShowInfo}
              isScreenshotMode={isScreenshotMode}
            />
            {getArrayOfLength(concoctionSlotCount).map((index) => {
              // Add 1 to the index because we already rendered the first slot
              const concoctionIndex = index + 1
              return (
                <BuilderButton
                  key={`concoction-${concoctionIndex}`}
                  item={buildState.items.concoction[concoctionIndex]}
                  isEditable={isEditable}
                  onClick={() =>
                    handleButtonClick('concoction', concoctionIndex)
                  }
                  onItemInfoClick={handleShowInfo}
                  isScreenshotMode={isScreenshotMode}
                />
              )
            })}
          </div>
        )}

        {buildState.items.consumable.every((i) => !i) && !isEditable ? null : (
          <div
            id="consumable-container"
            className={cn(
              'mt-4 flex flex-row flex-wrap items-start justify-between gap-x-2 gap-y-0 sm:justify-start',
              isScreenshotMode && 'justify-start',
            )}
          >
            {getArrayOfLength(4).map((consumableIndex) => (
              <BuilderButton
                key={`consumable-${consumableIndex}`}
                item={buildState.items.consumable[consumableIndex]}
                isEditable={isEditable}
                onClick={() => handleButtonClick('consumable', consumableIndex)}
                onItemInfoClick={handleShowInfo}
                isScreenshotMode={isScreenshotMode}
              />
            ))}
          </div>
        )}

        {includeMemberFeatures && (
          <div id="member-features-row" className="mt-4 w-full">
            <MemberFeatures
              description={buildState.description}
              isEditable={isEditable}
              isPublic={buildState.isPublic}
              isScreenshotModeActive={isScreenshotMode}
              onChangeDescription={handleChangeDescription}
              onChangeIsPublic={handleToggleIsPublic}
            />
          </div>
        )}
      </div>
    </div>
  )
}