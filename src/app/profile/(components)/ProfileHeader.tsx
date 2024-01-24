'use client'

import PlaceHolderIcon from '@/app/(components)/PlaceholderIcon'
import DisplayName from './DisplayName'
import { DEFAULT_DISPLAY_NAME } from '@/app/(data)/constants'
import Bio from './Bio'
import { getUserBio } from '../actions'
import { isErrorResponse } from '@/app/(types)'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  editable: boolean
  image?: string | null
  userId: string
}

export default function ProfileHeader({ editable, userId, image }: Props) {
  const [userProfile, setUserProfile] = useState<{
    bio?: string
    name: string
    displayName: string
  }>({
    bio: '',
    name: '',
    displayName: '',
  })

  useEffect(() => {
    const getUserBioAsync = async () => {
      const response = await getUserBio(userId)
      if (!response) return
      if (isErrorResponse(response)) {
        console.error(response.errors)
        return
      }

      setUserProfile(response)
    }
    getUserBioAsync()
  }, [userId])

  const { name, displayName } = userProfile

  return (
    <div className="max-w-xl">
      <div className="mb-8 flex w-full items-center justify-center">
        <div className="flex flex-col items-center gap-x-8 gap-y-4 sm:flex-row sm:gap-y-0">
          {image ? (
            <img
              src={image}
              alt={`Profile picture of ${name}`}
              className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            />
          ) : (
            <span className="h-24 w-24 flex-none rounded-lg bg-gray-100 object-cover">
              <PlaceHolderIcon />
            </span>
          )}
          <div className="flex flex-col items-start gap-0">
            <DisplayName
              name={displayName ?? name ?? DEFAULT_DISPLAY_NAME}
              editable={editable}
            />
            <span className="text-md text-gray-400">{name}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Bio
          bio={userProfile.bio ?? 'No bio is set yet.'}
          editable={editable}
        />
      </div>
      {editable && (
        <div className="my-8 flex items-center justify-center">
          <Link
            className="text-md text-green-500 underline "
            href={`/profile/${userId}`}
          >
            View your public profile
          </Link>
        </div>
      )}
    </div>
  )
}
