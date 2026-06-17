// Title.jsx
import React from 'react'
import { motion } from 'framer-motion'

const Title = ({ text1, text2 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex gap-3 items-center mb-3"
    >
      <p className="text-gray-400 font-light tracking-[0.12em] uppercase text-sm sm:text-base">
        {text1}{' '}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-gray-800 font-semibold"
        >
          {text2}
        </motion.span>
      </p>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25, duration: 0.5, ease: 'easeInOut' }}
        className="block w-8 sm:w-12 h-0.5 bg-gray-700 rounded-full origin-left"
      />
    </motion.div>
  )
}

export default Title