'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text'>('default')
  const [cursorText, setCursorText] = useState('')

  // Mouse position motion values
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring physics config for smooth trail
  const springConfig = { damping: 40, stiffness: 350, mass: 0.6 }
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Hide cursor on touch devices or screens smaller than 768px
    const checkDevice = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches
      const isMobile = window.innerWidth <= 768
      setIsVisible(!isTouch && !isMobile)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return

      // Find if we are hovering over an interactive element or a text-badge trigger
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, [data-cursor-text]')
      
      if (interactive) {
        const text = interactive.getAttribute('data-cursor-text')
        if (text) {
          setCursorType('text')
          setCursorText(text)
        } else {
          setCursorType('pointer')
          setCursorText('')
        }
      } else {
        setCursorType('default')
        setCursorText('')
      }
    }

    const handleMouseLeaveWindow = () => {
      setIsVisible(false)
    }

    const handleMouseEnterWindow = () => {
      checkDevice()
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeaveWindow)
    document.addEventListener('mouseenter', handleMouseEnterWindow)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeaveWindow)
      document.removeEventListener('mouseenter', handleMouseEnterWindow)
    }
  }, [mouseX, mouseY])

  if (!isVisible) return null

  // Variants for outer ring morphing
  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: 'rgba(201, 169, 110, 0)',
      border: '1.5px solid rgba(201, 169, 110, 0.75)',
      borderRadius: '50%',
    },
    pointer: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(201, 169, 110, 0.12)',
      border: '1.5px solid rgba(201, 169, 110, 1)',
      borderRadius: '50%',
    },
    text: {
      width: 72,
      height: 72,
      backgroundColor: 'rgba(26, 18, 8, 0.95)',
      border: '1.5px solid rgba(201, 169, 110, 0.9)',
      borderRadius: '50%',
    },
  }

  // Variants for inner dot
  const dotVariants = {
    default: {
      scale: 1,
      opacity: 1,
      backgroundColor: '#c9a96e',
    },
    pointer: {
      scale: 0.5,
      opacity: 0.5,
      backgroundColor: '#c9a96e',
    },
    text: {
      scale: 0,
      opacity: 0,
    },
  }

  return (
    <>
      {/* Outer Spring-tracked Ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden text-center mix-blend-normal shadow-[0_0_20px_rgba(201,169,110,0.1)]"
        style={{
          x: ringX,
          y: ringY,
        }}
        variants={ringVariants}
        animate={cursorType}
        transition={{ type: 'spring', damping: 30, stiffness: 250, mass: 0.8 }}
      >
        {cursorType === 'text' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="font-sans text-[9px] font-bold uppercase tracking-[2.5px] text-[#f0d060]"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner Immediate Dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        variants={dotVariants}
        animate={cursorType}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
