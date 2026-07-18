import { useEffect, useRef, useState } from 'react'

/**
 * Fires a one-shot "visible" flag when the element enters the viewport.
 * Use the returned ref on the section/container you want to animate.
 *
 * @param {IntersectionObserverInit} options
 * @returns {{ ref, isVisible }}
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // only trigger once
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible }
}
