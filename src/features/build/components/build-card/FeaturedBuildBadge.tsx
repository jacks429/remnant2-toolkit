import Image from 'next/image'

import { Tooltip } from '@/features/ui/Tooltip'

export function FeaturedBuildBadge({
  unoptimized = false,
}: {
  unoptimized?: boolean
}) {
  return (
    <Tooltip content={`Denotes a build is a featured build in the toolkit.`}>
      <button aria-label="Badge denoting the build is a featured build in the toolkit.">
        <Image
          src={`https://${process.env.NEXT_PUBLIC_IMAGE_URL}/badges/featured_build_badge.png`}
          width={50}
          height={50}
          alt="Badge denoting the build is a featured build in the toolkit."
          className="h-[50px] max-h-[50px] w-[50px] max-w-[50px]"
          loading="eager"
          unoptimized={unoptimized}
        />
      </button>
    </Tooltip>
  )
}
