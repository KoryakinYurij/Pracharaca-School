import type { PropsWithChildren } from 'react'
import { lazy, memo, Suspense } from 'react'

// Memoized to prevent re-rendering the heavy 3D scene on route changes
const BackgroundScene = memo(lazy(() => import('./BackgroundScene')))

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen text-graphite">
      <Suspense fallback={null}>
        <BackgroundScene />
      </Suspense>
      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12 lg:py-14">
        {children}
      </main>
    </div>
  )
}
