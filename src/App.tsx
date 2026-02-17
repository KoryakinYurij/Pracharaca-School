import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PageTransition } from './components/PageTransition'
import { ScrollToTop } from './components/ScrollToTop'
import { LessonPage } from './pages/LessonPage'
import { TopicPage } from './pages/TopicPage'
import { TopicsListingPage } from './pages/TopicsListingPage'

function AppRoutes() {
  const location = useLocation()

  return (
    <Layout>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
