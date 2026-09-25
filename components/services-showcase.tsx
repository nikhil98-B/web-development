'use client'

import { motion } from 'framer-motion'
import { Reveal } from './reveal'
import { useBooking } from './booking-provider'

type Cell = {
  category: string
  name: string
  service: string
  image: string
  span: string
}

const CELLS: Cell[] = [
  {
    category: 'Featured',
    name: 'Hair Treatments & Spa',
    service: 'Hair Treatment & Spa',
    image: '/services/hair-spa.png',
    span: 'col-span-2 md:col-span-2 md:row-span-2',
  },
  {
    category: 'Transform',
    name: 'Bridal Makeup',
    service: 'Bridal Makeup',
    image: '/services/bridal-makeup.png',
    span: '',
  },
  {
    category: 'Colour',
    name: 'Colouring & Balayage',
    service: 'Hair Colouring & Balayage',
    image: '/services/hair-colour.png',
    span: '',
  },
  {
    category: 'Smooth & Sleek',
    name: 'Keratin & Smoothening',
    service: 'Keratin & Smoothening',
    image: '/services/keratin.png',
    span: 'col-span-2 md:col-span-2',
  },
  {
    category: 'Glow',
    name: 'Facials & Cleanup',
    service: 'Facial & Cleanup',
    image: '/services/facial.png',
    span: '',
  },
  {
    category: 'Nail Art',
    name: 'Manicure & Pedicure',
    service: 'Manicure & Pedicure',
    image: '/services/nails.png',
    span: '',
  },
  {
    category: 'Wellness',
    name: 'Body Massage & Polish',
    service: 'Body Massage & Polish',
    image: '/services/massage.png',
    span: 'col-span-2 md:col-span-2',
  },
]

export function ServicesShowcase() {
  const { open } = useBooking()

  return (
    <section id="experience" className="bg-background">
      <div className="px-[5%] pb-14 pt-24 text-center">
        <Reveal>
          <p className="mb-3 text-[11px] uppercase tracking-[4px] text-gold">
            What We Offer
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Crafted for{' '}
            <em className="italic text-gold">Every You</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            From everyday care to once-in-a-lifetime transformations —
            experience luxury, precision, and artistry in every service.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-3 px-[5%] pb-24 md:grid-cols-4">
        {CELLS.map((cell, i) => (
          <motion.button
            key={cell.name}
            onClick={() => open(cell.service)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.8,
              delay: (i % 4) * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            data-cursor-text="BOOK"
            className={`group relative min-h-64 overflow-hidden rounded-2xl border border-border text-left cursor-pointer ${cell.span}`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.img
                initial={{ scale: 1.25, filter: 'blur(4px) brightness(0.6)' }}
                whileInView={{ scale: 1, filter: 'blur(0px) brightness(1)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.08 }}
                whileHover={{ scale: 1.08 }}
                src={cell.image || '/placeholder.svg'}
                alt={cell.name}
                className="size-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 pointer-events-none">
              <p className="mb-1.5 translate-y-2 text-[9px] uppercase tracking-[3px] text-gold-light opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {cell.category}
              </p>
              <h3 className="font-serif text-lg font-bold leading-tight text-white sm:text-xl">
                {cell.name}
              </h3>
              <span className="mt-3 w-fit translate-y-2 rounded-full bg-gold px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Book Now
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
