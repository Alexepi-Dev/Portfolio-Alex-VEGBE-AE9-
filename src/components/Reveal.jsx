import { motion } from 'framer-motion'

// Apparition douce au scroll (une seule fois)
export default function Reveal({ children, delay = 0, y = 28, x = 0, as = 'div', className, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
