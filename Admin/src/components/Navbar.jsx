// Navbar.jsx
import React from 'react'
import logo from '../assets/logo.png'
import { BACKEND_URL } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Navbar = ({ setToken }) => {

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/users/logout`, {}, { withCredentials: true })
      if (response) {
        localStorage.removeItem('adminToken')
        setToken('')
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between px-5 sm:px-8 py-3.5">

        {/* Logo + badge */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <img src={logo} alt="Logo" className="w-[max(90px,7%)] object-contain" />
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="text-[9px] tracking-[0.2em] uppercase font-semibold bg-gray-900 text-white px-2.5 py-1 rounded-full hidden sm:block"
          >
            Admin Panel
          </motion.span>
        </motion.div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            System Online
          </motion.div>

          {/* Logout */}
          <motion.button
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#0f0f0f] text-white px-4 py-2 rounded-xl text-xs tracking-[0.12em] uppercase font-medium cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar