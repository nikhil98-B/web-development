'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize smooth scroll on desktop / hover-capable devices
    // Touch screens have high-quality native physics-based scrolling already.
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
    })

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    // Store in window for access if needed (e.g. to stop scroll during modal open)
    ;(window as any).lenis = lenis

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
      delete (window as any).lenis
    }
  }, [])

  return <>{children}</>
}
