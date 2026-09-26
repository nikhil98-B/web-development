'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function IntroScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const body = document.body
    body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      setShow(false)
      body.style.overflow = ''
    }, 3200)
    return () => {
      clearTimeout(t)
      body.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-[#0e0e0e]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        >
          <motion.div
            className="flex size-32 items-center justify-center rounded-full border-2 border-gold bg-gradient-to-br from-neutral-700 to-neutral-900 shadow-[0_0_50px_rgba(201,169,110,0.45)]"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <span className="font-serif text-4xl font-bold text-gold">DS</span>
          </motion.div>

          <motion.h1
            className="px-6 text-center font-serif text-3xl text-white sm:text-5xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            Dheeraj Hair Story
          </motion.h1>

          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 220 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          />

          <motion.p
            className="text-center text-[11px] uppercase tracking-[6px] text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.8 }}
          >
            Style &bull; Care &bull; Tradition
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
