'use client'

import { useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function Magnetic({
  children,
  range = 60,
  strength = 0.35,
}: {
  children: React.ReactNode
  range?: number
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  // Spring values for layout-independent animation
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2

    // Distance from center
    const distanceX = clientX - centerX
    const distanceY = clientY - centerY

    // If within active radius, apply magnetic pull
    const distance = Math.hypot(distanceX, distanceY)

    if (distance < range) {
      setHovered(true)
      x.set(distanceX * strength)
      y.set(distanceY * strength)
    } else {
      handleMouseLeave()
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block"
      animate={{ scale: hovered ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
