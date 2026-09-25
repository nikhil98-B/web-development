'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useBooking } from './booking-provider'

const LINKS = [
  { href: '#experience', label: 'Services' },
  { href: '#team', label: 'Our Team' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const { open } = useBooking()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkColor = scrolled ? 'text-foreground' : 'text-white'

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 3.4 }}
        className={`fixed inset-x-0 top-0 z-[1000] flex h-16 items-center justify-between px-[5%] transition-colors duration-300 ${
          scrolled
            ? 'border-b border-border bg-white/90 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <a
          href="#hero"
          className={`flex items-center gap-2.5 font-serif text-lg font-bold tracking-wide transition-colors ${linkColor}`}
        >
          <span className="inline-block size-2 shrink-0 rounded-full bg-gold" />
          Dheeraj Hair Story
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-xs uppercase tracking-[2px] transition-colors hover:text-gold ${linkColor}`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={() => open(null)}
              className="rounded-full bg-gold px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-gold-dark"
            >
              Book Now
            </button>
          </li>
        </ul>

        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className={`md:hidden ${linkColor}`}
        >
          <Menu className="size-6" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1001] flex flex-col items-center justify-center gap-8 bg-neutral-950/97 backdrop-blur-md md:hidden"
          >
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute right-6 top-5 text-white"
            >
              <X className="size-7" />
            </button>
            {LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                className="font-serif text-2xl text-white transition-colors hover:text-gold"
              >
                {l.label}
              </motion.a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false)
                open(null)
              }}
              className="rounded-full bg-gold px-9 py-3.5 text-sm font-semibold uppercase tracking-wider text-white"
            >
              Book Appointment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
