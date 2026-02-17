# Анимации и переходы

## Роут-переходы

### Реализация

```tsx
// App.tsx
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { PageTransition } from './components/PageTransition'

function AppRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><TopicsListingPage /></PageTransition>} />
        <Route path="/topic/:slug" element={<PageTransition><TopicPage /></PageTransition>} />
        <Route path="/topic/:slug/lesson/:lessonSlug" element={<PageTransition><LessonPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
```

### Характеристики

- **Тип**: мягкий fade + небольшой y-shift
- **Длительность**: 380ms (0.38s)
- **Easing**: cubic-bezier(0.22, 1, 0.36, 1)
- **Запрещено**: резкие слайды, масштабирование, вращение

### Пример

```tsx
<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
  transition={{
    duration: prefersReducedMotion ? 0.15 : 0.38,
    ease: [0.22, 1, 0.36, 1],
  }}
>
  {children}
</motion.div>
```

## Анимации карточек

- **Раскрытие**: CSS Grid через `grid-template-rows` (0fr → 1fr), управляемый атрибутом `data-open` на div-контейнере
- **Chevron**: вращение на 180° при открытии
- **Длительность**: 700ms
- **Easing**: cubic-bezier(0.22, 1, 0.36, 1)

## Уважение к prefers-reduced-motion

```tsx
const prefersReducedMotion = useReducedMotion()

const transition = prefersReducedMotion 
  ? { duration: 0.15, y: 0 } 
  : { duration: 0.38, y: 10 }
```
