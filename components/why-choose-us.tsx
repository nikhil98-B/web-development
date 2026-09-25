'use client'

import { motion } from 'framer-motion'
import { Scissors, Leaf, Crown, CalendarCheck } from 'lucide-react'
import { Reveal } from './reveal'
import Image from 'next/image'
import { TiltGlowCard } from './tilt-glow-card'

const FEATURES = [
  {
    icon: Scissors,
    title: 'Expert Stylists',
    desc: 'Trained professionals with years of experience in the latest global trends and techniques.',
  },
  {
    icon: Leaf,
    title: 'Premium Products',
    desc: "We use only trusted brands — L'Oréal, Schwarzkopf, GK, O3+, Wella and more.",
  },
  {
    icon: Crown,
    title: 'Bridal Specialists',
    desc: 'Signature bridal packages for your most special day. You deserve nothing but the best.',
  },
  {
    icon: CalendarCheck,
    title: 'Guaranteed Slots',
    desc: "Real-time slot confirmation — once you book, it's yours. No double bookings, ever.",
  },
]

export function WhyChooseUs() {
  return (
    <section id="about" className="bg-background">

      {/* ── HERO IMAGE BLOCK ── */}
      <Reveal>
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(320px, 55vw, 620px)' }}>
          <Image
            src="/team/dheeraj.png"
            alt="Dheeraj Hair Story Salon"
            fill
            className="object-cover object-top"
            priority
          />
          {/* subtle dark gradient at bottom so text below reads cleanly */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.0) 60%, rgba(255,255,255,0.6) 100%)',
            }}
          />
        </div>
      </Reveal>

      {/* ── ABOUT TEXT ── */}
      <div
        className="mx-auto px-[5%] py-16 text-center"
        style={{ maxWidth: '720px' }}
      >
        <Reveal>
          <p
            className="mb-3 text-[10px] font-semibold uppercase tracking-[4px]"
            style={{ color: '#c9a227' }}
          >
            About Us
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl mb-6"
            style={{ color: '#1a1208' }}
          >
            A Professional{' '}
            <em className="italic" style={{ color: '#c9a227' }}>
              Hair Story
            </em>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            className="mx-auto mb-3"
            style={{
              width: '40px',
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
            }}
          />
        </Reveal>

        <Reveal delay={0.2}>
          <p
            className="text-sm leading-[1.95] mb-5"
            style={{ color: '#5a4a2a' }}
          >
            Nestled in the heart of Gorakhpur, Dheeraj Hair Story was born from
            a simple belief — that every person deserves to look and feel their
            absolute best. Founded by Dheeraj, a passionate stylist with over a
            decade of experience, our salon has grown into one of the most
            trusted beauty destinations in the city.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <p
            className="text-sm leading-[1.95] mb-5"
            style={{ color: '#5a4a2a' }}
          >
            We combine the latest global techniques with a warm, personal touch
            that keeps our clients coming back. Whether you are preparing for
            your wedding day, a special occasion, or simply a fresh new look —
            our team of trained professionals is here to make it happen with
            precision, care, and artistry.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <p
            className="text-sm leading-[1.95]"
            style={{ color: '#5a4a2a' }}
          >
            At Dheeraj Hair Story, beauty is not just a service — it is an
            experience. We use only premium, trusted products and stay updated
            with the finest trends in hair, skin, and bridal styling. Every
            visit is crafted to leave you feeling confident, refreshed, and
            truly transformed.
          </p>
        </Reveal>
      </div>

      {/* ── GOLD DIVIDER ── */}
      <Reveal>
        <div className="flex items-center justify-center gap-4 px-[5%] mb-16">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #e8dfc8)' }} />
          <div
            className="text-[10px] uppercase tracking-[4px] font-semibold px-4"
            style={{ color: '#c9a227' }}
          >
            Why Choose Us
          </div>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #e8dfc8, transparent)' }} />
        </div>
      </Reveal>

      {/* ── HEADING ── */}
      <div className="text-center px-[5%] mb-12">
        <Reveal>
          <h2
            className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl"
            style={{ color: '#1a1208' }}
          >
            The{' '}
            <em className="italic" style={{ color: '#c9a227' }}>
              Dheeraj
            </em>{' '}
            Difference
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed"
            style={{ color: '#8a7040' }}
          >
            A salon built on craft, care, and the belief that every client
            deserves a transformative experience.
          </p>
        </Reveal>
      </div>

      {/* ── FEATURE CARDS ── */}
      <div className="mx-auto grid max-w-5xl gap-5 px-[5%] pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex"
          >
            <TiltGlowCard className="w-full flex-1">
              <motion.div
                className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(201,162,39,0.1)',
                  color: '#c9a227',
                  transform: 'translateZ(15px)',
                }}
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                <f.icon className="size-6" strokeWidth={1.5} />
              </motion.div>
              <h3
                className="mb-2 font-serif text-lg font-bold"
                style={{ color: '#1a1208', transform: 'translateZ(25px)' }}
              >
                {f.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#8a7040', transform: 'translateZ(10px)' }}
              >
                {f.desc}
              </p>
            </TiltGlowCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}