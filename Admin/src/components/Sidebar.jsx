// Sidebar.jsx
import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  {
    to: "/add",
    label: "Add Items",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    desc: "Upload new products",
  },
  {
    to: "/list",
    label: "List Items",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    desc: "Manage catalogue",
  },
  {
    to: "/order",
    label: "Orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    desc: "View & manage orders",
  },
]

const Sidebar = () => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-white border-r border-gray-100 flex flex-col"
      style={{ width: collapsed ? 72 : 220, transition: "width 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >

      {/* Collapse toggle */}
      <div className="flex justify-end px-3 pt-5 pb-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(p => !p)}
          className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 cursor-pointer"
        >
          <motion.svg
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </motion.svg>
        </motion.button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1.5 px-3 pt-2 flex-1">
        {navItems.map((item, i) => {
          const isActive = location.pathname === item.to
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <NavLink to={item.to}>
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`relative flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                    isActive
                      ? "bg-[#0f0f0f] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-[#0f0f0f] rounded-2xl -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-700"}`}>
                    {item.icon}
                  </div>

                  {/* Label + desc */}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className={`text-sm font-medium whitespace-nowrap ${isActive ? "text-white" : "text-gray-700"}`}>
                          {item.label}
                        </p>
                        <p className={`text-[10px] whitespace-nowrap ${isActive ? "text-white/50" : "text-gray-400"}`}>
                          {item.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </NavLink>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom info */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-5 border-t border-gray-50 mx-3 mb-4"
          >
            <div className="bg-gray-50 rounded-2xl px-3 py-3 border border-gray-100">
              <p className="text-[9px] tracking-[0.18em] text-gray-400 uppercase mb-0.5">Logged in as</p>
              <p className="text-xs font-semibold text-gray-800">Administrator</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[9px] text-gray-400">Active session</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}

export default Sidebar