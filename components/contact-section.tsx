'use client'

import { Phone, Clock, MapPin } from 'lucide-react'
import { Reveal } from './reveal'
import { useBooking } from './booking-provider'

const INFO = [
  { icon: Phone, label: 'Phone / WhatsApp', value: '+91 91181 74789' },
  { icon: Clock, label: 'Hours', value: '10:00 AM – 9:00 PM' },
  { icon: MapPin, label: 'Location', value: 'Gorakhpur, UP' },
]

export function ContactSection() {
  const { open } = useBooking()
  return (
    <section
      id="contact"
      className="border-t border-border bg-cream px-[5%] py-24 text-center"
    >
      <Reveal>
        <p className="mb-3 text-[11px] uppercase tracking-[4px] text-gold">
          Visit Us
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
          Come <span className="gold-shimmer">Experience</span> Us
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mx-auto mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          Walk in or book ahead — we&apos;re ready to welcome you.
        </p>
      </Reveal>

      <div className="mx-auto my-12 flex max-w-3xl flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
        {INFO.map((item, i) => (
          <Reveal key={item.label} delay={0.1 * i} direction="up">
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                <item.icon className="size-5" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] uppercase tracking-[3px] text-gold">
                {item.label}
              </span>
              <span className="font-serif text-lg text-foreground">
                {item.value}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <button
          onClick={() => open(null)}
          className="rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-[2px] text-white shadow-[0_4px_20px_rgba(201,169,110,0.4)] transition-all hover:-translate-y-0.5 hover:bg-gold-dark"
        >
          Book Your Appointment Now
        </button>
      </Reveal>
    </section>
  )
}
