import { useEffect, useState, useRef } from 'react'

export function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!start) return
    
    let startTime = null
    const startValue = 0

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      // Preserve one decimal for targets like 4.9 (otherwise they'd show as 5)
      const decimals = Number.isInteger(target) ? 0 : 1
      const current = parseFloat((startValue + (target - startValue) * eased).toFixed(decimals))
      
      setCount(current)
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, start])

  return count
}
