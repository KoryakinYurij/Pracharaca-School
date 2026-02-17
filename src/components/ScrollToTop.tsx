import { useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [pathname, prefersReducedMotion])

  return null
}
