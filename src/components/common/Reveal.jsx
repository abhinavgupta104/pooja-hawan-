import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll-triggered reveal wrapper.
 *
 * <Reveal>                       — fades/slides the whole block in on scroll
 * <Reveal selector=".card">      — staggers matching children instead
 *
 * Props: y (px offset), delay, stagger, start (ScrollTrigger start), once
 */
export default function Reveal({
  children,
  y = 40,
  delay = 0,
  stagger = 0.1,
  duration = 0.9,
  start = 'top 84%',
  selector = null,
  style,
  className,
  ...rest
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const targets = selector ? el.querySelectorAll(selector) : el
    if (selector && targets.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: 'power3.out',
          stagger: selector ? stagger : 0,
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} style={style} className={className} {...rest}>
      {children}
    </div>
  )
}
