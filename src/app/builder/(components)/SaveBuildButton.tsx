import { signIn, useSession } from 'next-auth/react'
import useBuildSearchParams from '../(hooks)/useBuildSearchParams'
import { buttonClasses } from './Button'
import { cn } from '@/app/(lib)/utils'
import { toast } from 'react-toastify'

export default function SaveBuildButton() {
  const { data: session, status } = useSession()
  const { currentBuildState } = useBuildSearchParams()

  async function handleSaveBuild() {
    const response = await fetch('/api/build', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentBuildState),
    })
    const data = await response.json()
    toast.success(data.message)
    console.log(data)
  }

  if (status === 'loading') {
    return null
  }

  if (status === 'unauthenticated') {
    return (
      <button
        type="submit"
        className={cn(buttonClasses, 'border-red-500 hover:bg-red-700')}
        onClick={() => signIn()}
      >
        Sign In to Save Build
      </button>
    )
  }

  return (
    <button
      type="submit"
      className={cn(buttonClasses, 'border-green-500 hover:bg-green-700')}
      onClick={handleSaveBuild}
    >
      Save Build
    </button>
  )
}