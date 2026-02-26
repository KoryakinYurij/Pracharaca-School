import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PageTransition } from './components/PageTransition'
import { ScrollToTop } from './components/ScrollToTop'
import { LessonPage } from './pages/LessonPage'
import { TopicPage } from './pages/TopicPage'
import { TopicsListingPage } from './pages/TopicsListingPage'

const ContentKitchenSink = lazy(() =>
  import('./pages/ContentKitchenSink').then((m) => ({ default: m.ContentKitchenSink }))
)

function AppContent() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <TopicsListingPage />
              </PageTransition>
            }
          />
          <Route
            path="/topic/:slug"
            element={
              <PageTransition>
                <TopicPage />
              </PageTransition>
            }
          />
          <Route
            path="/topic/:slug/lesson/:lessonSlug"
            element={
              <PageTransition>
                <LessonPage />
              </PageTransition>
            }
          />
          <Route path="/lesson/*" element={<Navigate to="/" replace />} />
          {import.meta.env.DEV && (
            <Route
              path="/kitchen-sink"
              element={
                <PageTransition>
                  <Suspense fallback={<div className="p-8 text-center text-graphite/50">Loading…</div>}>
                    <ContentKitchenSink />
                  </Suspense>
                </PageTransition>
              }
            />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppContent />
      </Layout>
    </BrowserRouter>
  )
}

export default App
