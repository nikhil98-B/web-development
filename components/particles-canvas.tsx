'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  alpha: number
  targetAlpha: number
  fadeSpeed: number
}

export function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const maxParticles = isMobile ? 35 : 75

    const resizeCanvas = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * (window.devicePixelRatio || 1)
      canvas.height = rect.height * (window.devicePixelRatio || 1)
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
      initParticles()
    }

    const createParticle = (yOffset = 0): Particle => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      return {
        x: Math.random() * w,
        y: yOffset ? yOffset : Math.random() * h,
        size: Math.random() * 2 + 0.5, // 0.5px to 2.5px
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -(Math.random() * 0.25 + 0.05), // float upwards
        alpha: 0,
        targetAlpha: Math.random() * 0.5 + 0.1, // max alpha 0.6
        fadeSpeed: Math.random() * 0.005 + 0.002,
      }
    }

    const initParticles = () => {
      particles = []
      for (let i = 0; i < maxParticles; i++) {
        particles.push(createParticle())
      }
    }

    const animate = () => {
      if (!canvas || !ctx) return
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      ctx.clearRect(0, 0, w, h)

      particles.forEach((p, idx) => {
        // Handle fade in/out
        if (p.alpha < p.targetAlpha) {
          p.alpha += p.fadeSpeed
        }

        // Move particle
        p.x += p.speedX
        p.y += p.speedY

        // Drift horizontal randomly
        p.speedX += (Math.random() - 0.5) * 0.02
        if (p.speedX > 0.3) p.speedX = 0.3
        if (p.speedX < -0.3) p.speedX = -0.3

        // Reset if off-screen
        if (p.y < -10 || p.x < -10 || p.x > w + 10) {
          particles[idx] = createParticle(h + 10)
        }

        // Draw particle with glowing style
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${p.alpha})`
        ctx.shadowBlur = p.size * 2
        ctx.shadowColor = 'rgba(240, 208, 96, 0.4)'
        ctx.fill()
      })

      // Reset shadow for performance
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 size-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
