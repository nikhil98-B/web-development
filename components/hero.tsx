'use client'

import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useBooking } from './booking-provider'
import { Star } from 'lucide-react'
import { ParticlesCanvas } from './particles-canvas'
import { Magnetic } from './magnetic'

const STATS = [
  { num: '500+', label: 'Happy Clients' },
  { num: '10+', label: 'Years Exp.' },
  { num: '100+', label: 'Services' },
  { num: '5★', label: 'Rating' },
]

const TYPEWRITER_WORDS = [
  'Artistry',
  'Excellence',
  'Elegance',
  'Perfection',
]

const INTRO_DELAY = 3.4

// ── Typewriter Hook ──
function useTypewriter(words: string[], speed = 100, pause = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]

    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIndex((c) => c + 1)
        }
      } else {
        setDisplayed(current.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setDeleting(false)
          setWordIndex((w) => (w + 1) % words.length)
          setCharIndex(0)
        } else {
          setCharIndex((c) => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, wordIndex, words, speed, pause])

  return displayed
}

export function Hero() {
  const { open } = useBooking()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85])

  const typewriterText = useTypewriter(TYPEWRITER_WORDS)

  // Container variants for staggered stats
  const statsContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: INTRO_DELAY + 0.7,
      },
    },
  }

  const statsItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
    },
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-16"
    >
      {/* Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 scale-110 bg-cover bg-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-salon.png"
          alt="Interior of Dheeraj Hair Story salon"
          className="size-full object-cover"
        />
      </motion.div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 z-0 bg-neutral-950"
      />

      {/* Floating Gold Particles Canvas */}
      <ParticlesCanvas />

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Logo circle */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: INTRO_DELAY }}
          className="animate-float mb-5 flex size-28 items-center justify-center rounded-full border-2 border-gold bg-gradient-to-br from-neutral-500 to-neutral-800 shadow-[0_8px_40px_rgba(201,169,110,0.35)]"
        >
          <span className="font-serif text-4xl font-bold text-gold">DS</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: INTRO_DELAY + 0.15 }}
          className="mb-3 text-[10px] uppercase tracking-[5px] text-gold"
        >
          Gorakhpur&apos;s Premier Salon
        </motion.p>

        {/* ── TYPEWRITER HEADING ── */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: INTRO_DELAY + 0.25 }}
          className="text-balance font-serif text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
        >
          Where Style{' '}
          <em className="italic" style={{ color: '#c9a227' }}>
            Meets
          </em>
          <br />
          {/* Typewriter word */}
          <span className="relative inline-block">
            <span style={{ color: '#ffffff' }}>{typewriterText}</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: INTRO_DELAY + 0.4 }}
          className="mb-9 mt-4 text-[11px] uppercase tracking-[4px] text-white/75"
        >
          Style &bull; Care &bull; Tradition
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: INTRO_DELAY + 0.55 }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic range={75} strength={0.4}>
            <button
              onClick={() => open(null)}
              data-cursor-text="BOOK"
              className="rounded-full bg-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[2px] text-white shadow-[0_4px_20px_rgba(201,169,110,0.4)] transition-all hover:bg-gold-dark cursor-pointer"
            >
              Book Appointment
            </button>
          </Magnetic>
          <Magnetic range={75} strength={0.4}>
            <a
              href="#experience"
              className="rounded-full border border-white/60 px-8 py-3.5 text-xs font-medium uppercase tracking-[2px] text-white transition-colors hover:border-gold hover:text-gold cursor-pointer"
            >
              Explore Services
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* ── STATS ── */}
      <motion.div
        variants={statsContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mt-14 flex flex-wrap justify-center gap-3"
      >
        {STATS.map((s) => (
          <motion.div
            key={s.label}
            variants={statsItemVariants}
            whileHover={{ y: -6 }}
            className="min-w-24 rounded-2xl border border-gold/35 bg-black/35 px-6 py-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-black/50"
          >
            <div className="font-serif text-2xl font-bold text-gold">
              {s.num}
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[2px] text-white/75">
              {s.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}