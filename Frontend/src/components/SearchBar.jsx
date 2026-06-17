import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SearchBar = () => {
  const { search, setsearch, showsearch, setshowsearch } = useContext(ShopContext)
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setVisible(location.pathname.includes('collection'))
  }, [location])

  return (
    <AnimatePresence>
      {showsearch && visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden border-gray-100"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex items-center justify-center px-3 sm:px-0 py-4"
          >
            {/* Search input pill */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 w-3/4 sm:w-1/2 border border-gray-300 bg-white rounded-full px-5 py-2.5 shadow-sm focus-within:border-gray-800 focus-within:shadow-md transition-all duration-200"
            >
              {/* Search icon */}
              <motion.svg
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="#aaa" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </motion.svg>

              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                className="flex-1 outline-none bg-transparent text-sm text-gray-700 placeholder-gray-300 min-w-0"
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />

              {/* Clear text button */}
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    onClick={() => setsearch('')}
                    className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors shrink-0"
                  >
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <line x1="1" y1="1" x2="9" y2="9" stroke="#888" strokeWidth="1.8" strokeLinecap="round"/>
                      <line x1="9" y1="1" x2="1" y2="9" stroke="#888" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="w-px h-4 bg-gray-200 shrink-0" />

              {/* Close search bar */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400 }}
                onClick={() => { setshowsearch(false); setsearch('') }}
                className="cursor-pointer shrink-0"
              >
                <img src={assets.cross_icon} alt="close" className="w-3 opacity-50 hover:opacity-100 transition-opacity" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Typing indicator */}
          <AnimatePresence>
            {search && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-center text-[10px] text-gray-300 tracking-widest pb-3 -mt-1"
              >
                Searching for &nbsp;
                <span className="text-gray-500 font-medium">"{search}"</span>
              </motion.p>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchBar