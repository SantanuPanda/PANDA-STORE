import React, { useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null)
  const [email, setEmail] = useState('')
  const [subDone, setSubDone] = useState(false)

  const companyLinks = [
    { label: "Home", to: "/" },
    { label: "Collection", to: "/collection" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy Policy", to: "/" },
  ]

  const helpLinks = [
    { label: "Track Order", to: "/orders" },
    { label: "Returns", to: "/" },
    { label: "Shipping Info", to: "/" },
    { label: "Size Guide", to: "/" },
    { label: "FAQ", to: "/" },
  ]

  const socials = [
    {
      label: "Instagram", href: "#",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
    },
    {
      label: "Twitter", href: "#",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    },
    {
      label: "YouTube", href: "#",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
    },
    {
      label: "Pinterest", href: "#",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
    },
  ]

  const handleSub = (e) => {
    e.preventDefault()
    if (!email) return
    setSubDone(true)
    setEmail('')
    setTimeout(() => setSubDone(false), 3000)
  }

  return (
    <footer className="mt-15 overflow-hidden">

      {/* ── NEWSLETTER BAND ── */}
      <Reveal>
        <div className="bg-[#0f0f0f] px-6 sm:px-10 py-12 relative overflow-hidden rounded-3xl">
          {/* Blobs */}
          <div className="absolute top-[-40%] left-[-5%] w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "#c9a96e" }} />
          <div className="absolute bottom-[-40%] right-[-5%] w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "#a87ec9" }} />

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-1">Stay in the loop</p>
              <h3 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
                Get <span className="text-[#c9a96e]">20% off</span> your first order
              </h3>
            </div>

            <form onSubmit={handleSub} className="flex gap-2 w-full md:w-auto">
              <motion.div
                animate={{ boxShadow: subDone ? "0 0 0 2px #c9a96e" : "none" }}
                className="flex-1 md:w-64 rounded-xl overflow-hidden border border-white/10"
              >
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-full px-4 py-3 bg-white/5 text-white text-sm placeholder-white/20 outline-none"
                />
              </motion.div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-3 rounded-xl text-[11px] tracking-[0.18em] uppercase font-semibold text-[#0f0f0f] cursor-pointer shrink-0"
                style={{ background: "#c9a96e" }}
              >
                {subDone ? "✓ Done" : "Join"}
              </motion.button>
            </form>
          </div>
        </div>
      </Reveal>

      {/* ── MAIN FOOTER BODY ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.5fr_1fr_1fr_1fr] gap-12">

          {/* Brand */}
          <Reveal delay={0}>
            <div>
              <img src={assets.logo} className="w-28 mb-5" alt="Forever" />
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-7">
                Crafting timeless fashion since 2026. Style is not just what you wear —
                it's how you carry the world.
              </p>

              {/* Socials */}
              <div className="flex gap-2.5">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    title={s.label}
                    whileHover={{ y: -3, backgroundColor: "#0f0f0f", color: "#fff", borderColor: "#0f0f0f" }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer transition-colors"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Company */}
          <Reveal delay={0.08}>
            <div>
              <p className="text-[10px] tracking-[0.22em] font-semibold text-gray-900 uppercase mb-5">
                Company
              </p>
              <ul className="flex flex-col gap-2.5">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>
                      <motion.span
                        onHoverStart={() => setHoveredLink(link.label)}
                        onHoverEnd={() => setHoveredLink(null)}
                        className="text-sm text-gray-400 cursor-pointer flex items-center gap-1.5 group"
                        whileHover={{ x: 4, color: "#1a1a1a" }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <motion.span
                          animate={{ opacity: hoveredLink === link.label ? 1 : 0, x: hoveredLink === link.label ? 0 : -4 }}
                          className="text-[10px] text-gray-300"
                        >
                          →
                        </motion.span>
                        {link.label}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Help */}
          <Reveal delay={0.14}>
            <div>
              <p className="text-[10px] tracking-[0.22em] font-semibold text-gray-900 uppercase mb-5">
                Help
              </p>
              <ul className="flex flex-col gap-2.5">
                {helpLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>
                      <motion.span
                        onHoverStart={() => setHoveredLink(link.label)}
                        onHoverEnd={() => setHoveredLink(null)}
                        className="text-sm text-gray-400 cursor-pointer flex items-center gap-1.5"
                        whileHover={{ x: 4, color: "#1a1a1a" }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <motion.span
                          animate={{ opacity: hoveredLink === link.label ? 1 : 0, x: hoveredLink === link.label ? 0 : -4 }}
                          className="text-[10px] text-gray-300"
                        >
                          →
                        </motion.span>
                        {link.label}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delay={0.2}>
            <div>
              <p className="text-[10px] tracking-[0.22em] font-semibold text-gray-900 uppercase mb-5">
                Contact
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16.92z" /></svg>, text: "+91 9883696325" },
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></svg>, text: "santanupanda445@gmail.com" },
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>, text: "Khakurda,westBengal,INDIA" },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 group cursor-default"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 mt-0.5 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-200">
                      {item.icon}
                    </div>
                    <span className="text-sm text-gray-400 leading-snug pt-1">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* ── BOTTOM BAR ── */}
        <Reveal delay={0.25}>
          <div className="mt-14 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-xs text-gray-400 tracking-wide">
              © 2026{" "}
              <span className="text-gray-700 font-medium">santanu.dev</span>
              {" "}— All Rights Reserved.
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {["🔒 SSL Secure", "↩ Easy Returns", "🚚 Free Shipping"].map((b, i) => (
                <span key={i} className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full tracking-wide">
                  {b}
                </span>
              ))}
            </div>

            {/* Legal links */}
            <div className="flex gap-5">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <motion.span
                  key={item}
                  whileHover={{ color: "#1a1a1a" }}
                  className="text-xs text-gray-300 cursor-pointer tracking-wide transition-colors"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}

export default Footer