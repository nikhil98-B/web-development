'use client'

import { useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export function TiltGlowCard({
  children,
  className = '',
  backgroundColor = '#faf8f4',
  borderColor = '#ede5d0',
}: {
  children: React.ReactNode
  className?: string
  backgroundColor?: string
  borderColor?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for tilt angles
  const rotateXSpring = useSpring(0, { stiffness: 150, damping: 20 })
  const rotateYSpring = useSpring(0, { stiffness: 150, damping: 20 })

  // State for mouse position relative to card (for glow effect)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Position of mouse relative to card top-left
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePos({ x, y })

    // Normalize coordinates from -0.5 to 0.5
    const normalizedX = (x / width) - 0.5
    const normalizedY = (y / height) - 0.5

    // Map normalized coordinates to tilt angles (max 8 degrees tilt)
    rotateXSpring.set(-normalizedY * 12)
    rotateYSpring.set(normalizedX * 12)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotateXSpring.set(0)
    rotateYSpring.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`group relative rounded-3xl p-[1px] transition-shadow duration-500 ${className}`}
      animate={{
        y: isHovered ? -8 : 0,
        boxShadow: isHovered
          ? '0 20px 48px rgba(201,162,39,0.12), 0 0 0 1px rgba(201,162,39,0.08)'
          : '0 4px 12px rgba(0,0,0,0.01)',
      }}
    >
      {/* Dynamic Border Shine Overlay */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(201, 169, 110, 0.45), transparent 80%), ${borderColor}`,
        }}
      />

      {/* Static Default Border (Behind the shine) */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          border: `1.5px solid ${borderColor}`,
        }}
      />

      {/* Card Content Container */}
      <div
        className="relative size-full rounded-3xl p-8 text-center"
        style={{
          background: backgroundColor,
          transform: 'translateZ(20px)', // Pushes content forward for 3D depth
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
