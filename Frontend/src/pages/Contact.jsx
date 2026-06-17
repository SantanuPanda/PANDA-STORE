import React, { useState, useRef } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { motion, useInView, AnimatePresence } from "framer-motion";

const contactDetails = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Address",
    value: "Khakurda, Belda, Paschim Medinipur, West Bengal 721445, India",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: "+91 9883696325",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 7L2 7" />
      </svg>
    ),
    label: "Email",
    value: "santanupanda445@gmail.com",
  },
];

const faqs = [
  { q: "What are your working hours?", a: "We're available Monday–Friday, 9am–6pm EST. Our support team responds within 24 hours." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3–5 business days. Express options are available at checkout." },
  { q: "Can I track my order?", a: "Yes! Once your order ships, you'll receive a tracking link via email." },
];

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const infoRef = useRef(null)
  const infoInView = useInView(infoRef, { once: true, margin: "-60px" })

  const handleSend = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setFormState({ name: '', email: '', message: '' })
  }

  return (
    <div className="border-t border-gray-100 overflow-hidden">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center pt-14 pb-6 px-4"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-[10px] tracking-[0.22em] uppercase px-4 py-1.5 rounded-full mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
          Get In Touch
        </motion.span>
        <div className="text-3xl sm:text-4xl">
          <Title text1="CONTACT" text2="US" />
        </div>
      </motion.div>

      <div className="px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">

        {/* ── IMAGE + INFO ── */}
        <div ref={infoRef} className="flex flex-col md:flex-row gap-10 lg:gap-16 items-stretch mb-20">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={infoInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/2 rounded-3xl overflow-hidden min-h-75 bg-gray-100"
          >
            <img
              src={assets.contact_img}
              alt="contact"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={infoInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/2 flex flex-col gap-5"
          >

            {/* Store heading */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={infoInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-1"
              >
                Find Us
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="text-xl font-semibold text-gray-900"
              >
                Our Store
              </motion.h2>
            </div>

            {/* Contact detail cards */}
            {contactDetails.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.15em] text-gray-400 uppercase mb-0.5">{item.label}</p>
                  <p className="text-sm text-gray-700 leading-snug whitespace-pre-line">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Careers */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={infoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.45 }}
              className="bg-[#0f0f0f] rounded-2xl px-6 py-6 relative overflow-hidden"
            >
              <div className="absolute top-[-30%] right-[-10%] w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ background: '#c9a96e' }} />
              <div className="relative z-10">
                <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-1">Work With Us</p>
                <p className="text-base font-semibold text-white mb-1">Careers at Forever</p>
                <p className="text-xs text-white/40 mb-4 leading-relaxed">
                  Explore open roles and join a team that's shaping the future of fashion.
                </p>
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: '#c9a96e', color: '#0f0f0f' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="px-5 py-2.5 border border-white/20 text-white text-xs tracking-[0.15em] uppercase rounded-xl cursor-pointer transition-colors duration-200"
                >
                  Explore Jobs →
                </motion.button>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* ── CONTACT FORM + FAQ ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm"
          >
            <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-1">Drop a message</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Send Us a Note</h3>

            <form onSubmit={handleSend} className="flex flex-col gap-4">
              {[
                { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Alex Johnson' },
                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              ].map((field, i) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    value={formState[field.id]}
                    onChange={e => setFormState(p => ({ ...p, [field.id]: e.target.value }))}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-800 focus:bg-white transition-all"
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.28 }}
              >
                <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us how we can help..."
                  value={formState.message}
                  onChange={e => setFormState(p => ({ ...p, message: e.target.value }))}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-800 focus:bg-white transition-all resize-none"
                />
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-full py-3 bg-[#0f0f0f] text-white rounded-xl text-xs tracking-[0.15em] uppercase font-medium cursor-pointer overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center justify-center gap-2"
                    >
                      ✓ Message Sent!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      Send Message
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="mb-2">
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-1">Quick Answers</p>
              <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
            </div>

            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="border border-gray-100 rounded-2xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-gray-400 text-lg shrink-0 font-light"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed border-t border-gray-50 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="mt-2 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 h-36 flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-2xl mb-1">📍</p>
                <p className="text-xs text-gray-300 tracking-wide">Washington, USA</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;