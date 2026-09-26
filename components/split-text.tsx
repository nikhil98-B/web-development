'use client'

import { motion, type Variants } from 'framer-motion'

export function SplitTextReveal({
  text,
  className = '',
  delay = 0,
  duration = 0.9,
  tag: Tag = 'h2',
}: {
  text: string
  className?: string
  delay?: number
  duration?: number
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}) {
  const words = text.split(' ')

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    },
  }

  const wordVariants: Variants = {
    hidden: { y: '110%' },
    visible: {
      y: '0%',
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <Tag className={`overflow-hidden ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="inline-block flex-wrap"
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em] py-1">
            <motion.span
              variants={wordVariants}
              className="inline-block origin-bottom"
            >
              {word === '' ? '\u00A0' : word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
