'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Sparkles, X, ArrowRight, ArrowLeft } from 'lucide-react'

const SERVICES = [
  'Haircut & Styling',
  'Hair Treatment & Spa',
  'Hair Colouring & Balayage',
  'Keratin & Smoothening',
  'Bridal Makeup',
  'Party Makeup',
  'Facial & Cleanup',
  'Manicure & Pedicure',
  'Nail Art',
  "Men's Grooming",
  'Body Massage & Polish',
  'Mehendi',
]

const WHATSAPP_NUMBER = '919118174789'

type BookingContextValue = {
  open: (service?: string | null) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const open = useCallback((preset?: string | null) => {
    if (preset) setService(preset)
    setStep(1)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      setStep(1)
      setName('')
      setPhone('')
      setService('')
      setDate(new Date().toISOString().split('T')[0])
    }, 400)
  }, [])

  const isPhoneValid = /^[0-9]{10}$/.test(phone)
  const step1Valid = name.trim().length > 1 && isPhoneValid
  const step2Valid = !!service
  const step3Valid = !!date
  const valid = step1Valid && step2Valid && step3Valid

  const sendToWhatsApp = () => {
    if (!valid) return
    const formatted = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const message =
      `Hello Dheeraj Hair Story! I'd like to book an appointment.%0A%0A` +
      `*Name:* ${name}%0A` +
      `*Phone:* ${phone}%0A` +
      `*Service:* ${service}%0A` +
      `*Date:* ${formatted}`
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank',
      'noopener,noreferrer',
    )
    close()
  }

  useEffect(() => {
    if (!isOpen) return

    const scrollY = window.scrollY
    const body = document.body
    const originalOverflow = body.style.overflow
    const originalPosition = body.style.position
    const originalTop = body.style.top

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`

    return () => {
      body.style.overflow = originalOverflow
      body.style.position = originalPosition
      body.style.top = originalTop
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  const value = useMemo(() => ({ open }), [open])
  const today = new Date().toISOString().split('T')[0]

  const STEPS = ['Your Details', 'Choose Service', 'Pick a Date']

  return (
    <BookingContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: 'rgba(10,8,5,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={close}
          >
            <motion.div
              className="relative w-full sm:max-w-lg overflow-hidden rounded-t-[24px] sm:rounded-[24px] max-h-[calc(100vh-80px)]"
              style={{
                background: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 -8px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(212,175,55,0.25)',
              }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Gold shimmer top border */}
              <div
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, #c9a227 25%, #f0d060 50%, #c9a227 75%, transparent 100%)',
                }}
              />

              {/* Header */}
              <div className="px-7 pt-6 pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <motion.div
                      className="flex items-center gap-2 mb-1"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Sparkles
                        className="size-3.5"
                        style={{ color: '#c9a227' }}
                      />
                      <span
                        className="text-[9px] font-semibold uppercase tracking-[3.5px]"
                        style={{ color: '#c9a227' }}
                      >
                        Dheeraj Hair Story
                      </span>
                    </motion.div>
                    <motion.h2
                      className="text-[22px] font-serif font-normal leading-tight"
                      style={{ color: '#1a1208' }}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      Reserve Your Appointment
                    </motion.h2>
                  </div>
                  <motion.button
                    onClick={close}
                    aria-label="Close"
                    whileHover={{ scale: 1.08, rotate: 90 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full mt-1"
                    style={{
                      background: '#f5f0e8',
                      border: '1px solid #e8dfc8',
                      color: '#8a7040',
                    }}
                  >
                    <X className="size-3.5" />
                  </motion.button>
                </div>

                {/* Step pills */}
                <div className="flex items-center gap-0 mt-5">
                  {STEPS.map((label, i) => {
                    const s = i + 1
                    const active = step === s
                    const done = step > s
                    return (
                      <div key={s} className="flex items-center">
                        <motion.div
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all duration-400"
                          animate={{
                            background: active
                              ? '#1a1208'
                              : done
                              ? '#f5f0e8'
                              : 'transparent',
                            color: active
                              ? '#f0d060'
                              : done
                              ? '#c9a227'
                              : '#b0a080',
                          }}
                        >
                          <span
                            className="flex size-4 items-center justify-center rounded-full text-[9px] font-bold"
                            style={{
                              background: active
                                ? '#c9a227'
                                : done
                                ? '#c9a227'
                                : 'rgba(0,0,0,0.08)',
                              color: active || done ? '#1a1208' : '#999',
                            }}
                          >
                            {done ? '✓' : s}
                          </span>
                          {label}
                        </motion.div>
                        {s < 3 && (
                          <div
                            className="w-4 h-px mx-0.5 transition-all duration-500"
                            style={{
                              background: step > s ? '#c9a227' : '#e0d8c8',
                            }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Full-width gold divider */}
              <div
                className="mt-5 h-px w-full"
                style={{ background: 'linear-gradient(90deg, transparent, #e8dfc8 20%, #e8dfc8 80%, transparent)' }}
              />

              {/* Step body */}
              <div className="px-7 py-6 min-h-[230px] overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
                <AnimatePresence mode="wait">

                  {/* STEP 1 */}
                  {step === 1 && (
                    <motion.div
                      key="s1"
                      initial={{ opacity: 0, x: 35 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -35 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                      className="space-y-4"
                    >
                      <PremiumInput
                        label="Full Name"
                        value={name}
                        onChange={setName}
                        placeholder="Enter your full name"
                      />
                      <PremiumInput
                        label="WhatsApp Number"
                        value={phone}
                        onChange={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter your WhatsApp number"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                      />
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: 35 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -35 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    >
                      <div className="grid grid-cols-2 gap-2 max-h-[230px] overflow-y-auto pr-0.5"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#e8dfc8 transparent' }}
                      >
                        {SERVICES.map((s, i) => (
                          <motion.button
                            key={s}
                            onClick={() => setService(s)}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02, type: 'spring', stiffness: 180, damping: 15 }}
                            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(201,162,39,0.12)' }}
                            whileTap={{ scale: 0.97 }}
                            className="rounded-xl px-3 py-2.5 text-left text-[11px] font-medium leading-tight transition-all duration-200"
                            style={{
                              background:
                                service === s
                                  ? '#1a1208'
                                  : '#faf8f4',
                              color:
                                service === s
                                  ? '#f0d060'
                                  : '#4a3c20',
                              border:
                                service === s
                                  ? '1.5px solid #c9a227'
                                  : '1.5px solid #ede5d0',
                              boxShadow:
                                service === s
                                  ? '0 4px 16px rgba(201,162,39,0.18)'
                                  : 'none',
                            }}
                          >
                            {s}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <motion.div
                      key="s3"
                      initial={{ opacity: 0, x: 35 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -35 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                      className="space-y-4"
                    >
                      {/* Summary pill */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3"
                        style={{
                          background: 'linear-gradient(135deg, #fdf8ec, #faf3dc)',
                          border: '1px solid #e8d48a',
                        }}
                      >
                        <div
                          className="flex size-8 shrink-0 items-center justify-center rounded-full"
                          style={{ background: '#1a1208' }}
                        >
                          <Sparkles className="size-3.5" style={{ color: '#f0d060' }} />
                        </div>
                        <div>
                          <p
                            className="text-[9px] uppercase tracking-[2px] font-semibold"
                            style={{ color: '#a07828' }}
                          >
                            Selected Service
                          </p>
                          <p
                            className="text-sm font-semibold mt-0.5"
                            style={{ color: '#1a1208' }}
                          >
                            {service}
                          </p>
                        </div>
                      </motion.div>

                      {/* Date input */}
                      <div className="flex flex-col gap-2">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[2px]"
                          style={{ color: '#a07828' }}
                        >
                          Preferred Date
                        </span>
                        <motion.input
                          type="date"
                          min={today}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          whileFocus={{ scale: 1.01 }}
                          className="w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-all duration-200"
                          style={{
                            background: '#faf8f4',
                            border: '1.5px solid #ede5d0',
                            color: '#1a1208',
                            caretColor: '#c9a227',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.border = '1.5px solid #c9a227'
                            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(201,162,39,0.1)'
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.border = '1.5px solid #ede5d0'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        />
                        <p
                          className="text-[10px] text-center mt-1"
                          style={{ color: '#b09060' }}
                        >
                          Today is pre-selected — change if needed
                        </p>
                      </div>

                      {/* Booking summary */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl px-4 py-3 space-y-1.5"
                        style={{
                          background: '#f5f0e8',
                          border: '1px solid #e0d4b0',
                        }}
                      >
                        {[
                          { label: 'Name', val: name },
                          { label: 'Phone', val: phone },
                          { label: 'Service', val: service },
                        ].map(({ label, val }) => (
                          <div key={label} className="flex justify-between items-center">
                            <span
                              className="text-[10px] uppercase tracking-wider"
                              style={{ color: '#a07828' }}
                            >
                              {label}
                            </span>
                            <span
                              className="text-[11px] font-semibold"
                              style={{ color: '#1a1208' }}
                            >
                              {val}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div
                className="mx-7 h-px"
                style={{ background: '#ede5d0' }}
              />

              {/* Footer */}
              <div className="flex items-center justify-between px-7 py-4 pb-6">
                <motion.button
                  onClick={step > 1 ? () => setStep((s) => s - 1) : close}
                  whileHover={{ x: step > 1 ? -2 : 0 }}
                  className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold transition-colors"
                  style={{ color: '#8a7040' }}
                >
                  {step > 1 && <ArrowLeft className="size-3" />}
                  {step > 1 ? 'Back' : 'Cancel'}
                </motion.button>

                <AnimatePresence mode="wait">
                  {step < 3 ? (
                    <motion.button
                      key="next"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={step === 1 ? !step1Valid : !step2Valid}
                      whileHover={
                        (step === 1 ? step1Valid : step2Valid)
                          ? { x: 2, boxShadow: '0 6px 24px rgba(201,162,39,0.35)' }
                          : {}
                      }
                      whileTap={{ scale: 0.96 }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 rounded-full px-7 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300"
                      style={{
                        background:
                          (step === 1 ? step1Valid : step2Valid)
                            ? 'linear-gradient(135deg, #1a1208 0%, #3a2a10 100%)'
                            : '#ede5d0',
                        color:
                          (step === 1 ? step1Valid : step2Valid)
                            ? '#f0d060'
                            : '#b0a080',
                        boxShadow:
                          (step === 1 ? step1Valid : step2Valid)
                            ? '0 4px 18px rgba(26,18,8,0.22)'
                            : 'none',
                        cursor:
                          (step === 1 ? step1Valid : step2Valid)
                            ? 'pointer'
                            : 'not-allowed',
                      }}
                    >
                      Continue
                      <ArrowRight className="size-3.5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      key="confirm"
                      onClick={sendToWhatsApp}
                      disabled={!valid}
                      whileHover={valid ? { y: -1, boxShadow: '0 8px 28px rgba(37,211,102,0.35)' } : {}}
                      whileTap={{ scale: 0.96 }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 rounded-full px-7 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300"
                      style={{
                        background: valid
                          ? 'linear-gradient(135deg, #1aad52, #25D366)'
                          : '#ede5d0',
                        color: valid ? '#fff' : '#b0a080',
                        boxShadow: valid ? '0 4px 18px rgba(37,211,102,0.25)' : 'none',
                        cursor: valid ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <MessageCircle className="size-3.5" />
                      Book on WhatsApp
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  )
}

function PremiumInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  maxLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  inputMode?: string
  maxLength?: number
}) {
  return (
    <motion.label
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-[2.5px]"
        style={{ color: '#a07828' }}
      >
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200"
        style={{
          background: '#faf8f4',
          border: '1.5px solid #ede5d0',
          color: '#1a1208',
          caretColor: '#c9a227',
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = '1.5px solid #c9a227'
          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(201,162,39,0.10)'
          e.currentTarget.style.background = '#fffdf5'
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = '1.5px solid #ede5d0'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.background = '#faf8f4'
        }}
      />
    </motion.label>
  )
}