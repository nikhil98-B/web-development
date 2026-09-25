import { BookingProvider } from '@/components/booking-provider'
import { IntroScreen } from '@/components/intro-screen'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Marquee } from '@/components/marquee'
import { ServicesShowcase } from '@/components/services-showcase'
import { TeamSection } from '@/components/team-section'
import { WhyChooseUs } from '@/components/why-choose-us'
import { ContactSection } from '@/components/contact-section'
import { SiteFooter } from '@/components/site-footer'
import { BackToTop, ScrollProgress } from '@/components/back-to-top'

export default function Page() {
  return (
    <BookingProvider>
      <IntroScreen />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <ServicesShowcase />
        <TeamSection />
        <WhyChooseUs />
        <ContactSection />
      </main>
      <SiteFooter />
      <BackToTop />
    </BookingProvider>
  )
}
