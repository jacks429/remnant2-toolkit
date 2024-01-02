import Link from 'next/link'
import { NAV_ITEMS } from './(data)/constants'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import PageActions from './(components)/PageActions'
import BackToTopButton from './(components)/BackToTopButton'

export default function HomePage() {
  return (
    <>
      <PageActions>
        <BackToTopButton />
      </PageActions>
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          src={`https://${process.env.NEXT_PUBLIC_IMAGE_URL}/home-bg.webp`}
          alt="Home page background"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center"
        />
        <div className="sm:transform-g1 hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:blur-3xl">
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#9646ff] to-[#776fff] opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu">
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#9646ff] to-[#776fff] opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Remnant 2 Toolkit
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Welcome to the Remnant 2 Toolkit, a set of tools for the game
              Remnant 2.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                className="flex flex-row gap-x-4 rounded-xl border border-transparent bg-white/5 p-6 ring-1 ring-inset ring-white/10 hover:border-green-500"
              >
                <item.icon
                  className="h-7 w-7 flex-none text-green-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-base leading-7">{item.name}</p>
                  <p className="mt-2 text-gray-300 ">{item.description}</p>
                  <div className="mt-4 flex w-full items-center justify-end">
                    <ArrowRightIcon
                      className="h-6 w-6 text-green-500 hover:text-green-300"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
