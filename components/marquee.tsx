const ITEMS = [
  'Hair Treatment',
  'Bridal Makeup',
  'Keratin Therapy',
  'Hair Spa',
  'Nail Art',
  'Facial',
  'Waxing',
  'Hairstyles',
  'Mehendi',
  'Body Massage',
]

export function Marquee() {
  const loop = [...ITEMS, ...ITEMS]
  return (
    <div className="pause-on-hover overflow-hidden border-y border-border bg-cream py-7">
      <div className="animate-marquee flex w-max items-center gap-10">
        {loop.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-10 font-serif text-base text-muted-foreground"
          >
            {item}
            <span className="inline-block size-1.5 rounded-full bg-gold" />
          </div>
        ))}
      </div>
    </div>
  )
}
