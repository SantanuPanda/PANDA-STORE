import React, { useRef } from 'react'
import { assets } from '../assets/assets'
import { motion, useInView } from 'framer-motion'

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Easy Exchange",
    subtitle: "Policy",
    desc: "Swap styles effortlessly — no questions asked, no hassle guaranteed.",
    tag: "Instant",
    accent: "#e8f4f0",
    dot: "#4caf8f",
    emoji: "🔄",
  },
  {
    icon: assets.quality_icon,
    title: "7 Days Free",
    subtitle: "Returns",
    desc: "Changed your mind? Return anything within 7 days, completely free.",
    tag: "No Cost",
    accent: "#f4f0e8",
    dot: "#c9a96e",
    emoji: "📦",
  },
  {
    icon: assets.support_img,
    title: "24 / 7 Live",
    subtitle: "Support",
    desc: "Our team is always here — day or night, whenever you need us.",
    tag: "Always On",
    accent: "#f0e8f4",
    dot: "#a87ec9",
    emoji: "💬",
  },
]

const OurPolicy = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <section className="py-16 sm:py-24 px-4 overflow-hidden">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 sm:mb-16"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-[10px] tracking-[0.22em] uppercase px-4 py-1.5 rounded-full mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Why Choose Us
        </motion.span>

        <h2 className="text-3xl sm:text-4xl font-light text-[#1a1a1a] tracking-tight">
          Our&nbsp;<span className="font-semibold">Promise</span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
          className="mt-4 mx-auto w-10 h-0.5 bg-[#1a1a1a] rounded-full origin-center"
        />
      </motion.div>

      {/* ── MOBILE LAYOUT — horizontal scroll cards ── */}
      <div className="sm:hidden">
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {policies.map((policy, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex-none w-[78vw] snap-center rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm"
            >
              {/* Colored top strip */}
              <div className="h-1.5 w-full" style={{ background: policy.dot }} />

              <div className="p-6">
                {/* Icon + tag row */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: policy.accent }}
                  >
                    {policy.emoji}
                  </div>
                  <span
                    className="text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-1.5 rounded-full"
                    style={{ background: policy.accent, color: policy.dot }}
                  >
                    {policy.tag}
                  </span>
                </div>

                {/* Title */}
                <p className="text-lg font-bold text-gray-900 leading-tight">
                  {policy.title}
                </p>
                <p
                  className="text-sm font-medium mb-3 tracking-wide"
                  style={{ color: policy.dot }}
                >
                  {policy.subtitle}
                </p>

                {/* Desc */}
                <p className="text-xs text-gray-400 leading-relaxed">{policy.desc}</p>

                {/* Bottom accent line */}
                <motion.div
                  className="mt-5 h-0.5 rounded-full"
                  style={{ background: policy.dot }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 36 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll dots indicator */}
        <div className="flex justify-center gap-1.5 mt-4">
          {policies.map((p, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full opacity-40"
              style={{ background: p.dot }}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT — 3 column grid ── */}
      <div
        ref={ref}
        className="hidden sm:grid grid-cols-3 gap-5 max-w-8xl mx-auto"
      >
        {policies.map((policy, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(0,0,0,0.08)" }}
            className="relative rounded-xl border border-gray-100 bg-white overflow-hidden cursor-default transition-shadow duration-300 group"
          >
            {/* Accent bg on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 rounded-1xl"
              style={{ background: policy.accent }}
            />

            {/* Colored top strip */}
            <motion.div
              className="h-1 w-full"
              style={{ background: policy.dot }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: "easeInOut" }}
            />

            <div className="relative z-10 px-7 py-8 text-center">

              {/* Tag pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 400 }}
                className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full mb-5"
                style={{ background: policy.accent, color: policy.dot }}
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: policy.dot }}
                />
                {policy.tag}
              </motion.div>

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.12 }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: policy.accent }}
              >
                <img src={policy.icon} alt={policy.title} className="w-7 h-7 object-contain" />
              </motion.div>

              {/* Title */}
              <p className="text-base font-bold text-gray-900 leading-tight">
                {policy.title}
              </p>
              <p
                className="text-sm font-medium mb-3 tracking-wide"
                style={{ color: policy.dot }}
              >
                {policy.subtitle}
              </p>

              {/* Desc */}
              <p className="text-xs text-gray-400 leading-relaxed">
                {policy.desc}
              </p>

              {/* Bottom accent line */}
              <motion.div
                className="mt-7 mx-auto h-0.5 rounded-full"
                style={{ background: policy.dot }}
                initial={{ width: 0 }}
                animate={isInView ? { width: 36 } : {}}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  )
}

export default OurPolicy