export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-3 border-t border-border bg-white px-[5%] py-8 sm:flex-row">
      <div className="flex items-center gap-2.5 font-serif text-lg font-bold text-foreground">
        <span className="inline-block size-2 rounded-full bg-gold" />
        Dheeraj Hair Story
      </div>
      <p className="text-center text-[11px] tracking-wide text-muted-foreground">
        © {new Date().getFullYear()} Dheeraj Hair Story ·{' '}
        <span className="text-gold">Style · Care · Tradition</span>
      </p>
    </footer>
  )
}
