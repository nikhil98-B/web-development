'use client'

import { motion } from 'framer-motion'
import { Reveal } from './reveal'

type Member = {
  name: string
  role: string
  desc: string
  exp: string
  image: string
}

const TEAM: Member[] = [
  {
    name: 'Dheeraj Sharma',
    role: 'Founder & Master Stylist',
    desc: 'The visionary behind Dheeraj Hair Story, specialising in advanced hair treatments and bridal transformations.',
    exp: '10+ yrs',
    image: '/team/dheeraj.png',
  },
  {
    name: 'Seraj',
    role: 'Hair Colour Expert',
    desc: 'Our colour maestro, trained in balayage, ombre and global colouring with a creative, salon-perfect eye.',
    exp: '7+ yrs',
    image: '/team/seraj.png',
  },
  {
    name: 'Yuvraj',
    role: 'Keratin & Smoothening',
    desc: 'Excels in advanced hair smoothening and keratin, known for silky, frizz-free, precision results.',
    exp: '6+ yrs',
    image: '/team/yuvraj.png',
  },
  {
    name: 'Vivek',
    role: 'Hair Spa & Treatment',
    desc: 'Specialises in restorative hair spa and scalp care, breathing life back into stressed, damaged hair.',
    exp: '5+ yrs',
    image: '/team/vivek.png',
  },
  {
    name: 'Vishal',
    role: "Men's Grooming",
    desc: 'The go-to expert for men’s cuts and beard styling, blending classic barbering with modern technique.',
    exp: '5+ yrs',
    image: '/team/vishal.png',
  },
  {
    name: 'Rohit',
    role: 'Styling & Hairstyles',
    desc: 'Transforms hair with creative styles, curls and updos — from everyday looks to show-stopping party hair.',
    exp: '4+ yrs',
    image: '/team/rohit.png',
  },
  {
    name: 'Shalini Sharma',
    role: 'Bridal & Makeup Artist',
    desc: 'Crafts ethereal bridal looks for your most cherished moments — airbrush, HD and traditional styles.',
    exp: '8+ yrs',
    image: '/team/shalini.png',
  },
  {
    name: 'Nisha Sharma',
    role: 'Skincare & Facial',
    desc: 'Our skincare guru offering personalised facials, cleanup rituals and anti-aging treatments.',
    exp: '7+ yrs',
    image: '/team/nisha.png',
  },
]

export function TeamSection() {
  return (
    <section id="team" className="bg-cream px-[5%] py-24">
      <div className="text-center">
        <Reveal>
          <p className="mb-3 text-[11px] uppercase tracking-[4px] text-gold">
            The Artisans
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Meet Our <span className="gold-shimmer">Talented Team</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mb-16 mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Passionate professionals dedicated to bringing out your best look.
            Each stylist brings unique expertise and a personal touch.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {TEAM.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.8,
              delay: (i % 4) * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            data-cursor-text="MEET"
            className="group relative overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-shadow duration-500 hover:shadow-xl cursor-pointer"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.image || '/placeholder.svg'}
                alt={`${m.name}, ${m.role}`}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/placeholder.svg'
                }}
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* experience badge */}
              <div className="absolute right-3 top-3 rounded-full border border-gold/40 bg-black/40 px-3 py-1 text-[10px] font-semibold text-gold-light backdrop-blur-sm">
                {m.exp}
              </div>

              {/* base info */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-serif text-lg font-bold leading-tight text-white">
                  {m.name}
                </h3>
                <p className="text-[10px] uppercase tracking-[2px] text-gold-light">
                  {m.role}
                </p>

                {/* revealed description */}
                <div 
                  className="grid grid-rows-[0fr] opacity-0 transition-all group-hover:grid-rows-[1fr] group-hover:opacity-100"
                  style={{ transitionDuration: '450ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <p className="overflow-hidden text-xs leading-relaxed text-white/85">
                    <span className="mt-2 block">{m.desc}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}