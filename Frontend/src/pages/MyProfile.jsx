import React, { useState, useRef, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { motion, AnimatePresence } from 'framer-motion'

const MyProfile = () => {
  const { user, getUserProfile, updateUserProfile } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [nameFocused, setNameFocused] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  useEffect(() => { getUserProfile() }, [])

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhoto(user.photo || null)
    }
  }, [user])

  const handlePhoto = (file) => {
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handlePhoto(file)
  }

  const handleSave = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('name', name)
    if (photoFile) formData.append('photo', photoFile)
    await updateUserProfile(formData)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center p-4 sm:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >

        {/* ── CARD ── */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">

          {/* Dark header band */}
          <motion.div
            variants={itemVariants}
            className="bg-[#0f0f0f] px-8 pt-10 pb-16 text-center relative overflow-hidden"
          >
            {/* Blobs */}
            <div className="absolute top-[-30%] left-[-10%] w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: '#c9a96e' }} />
            <div className="absolute bottom-[-30%] right-[-10%] w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
              style={{ background: '#a87ec9' }} />

            <motion.p
              variants={itemVariants}
              className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-1"
            >
              Account
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="text-xl font-semibold text-white"
            >
              My Profile
            </motion.h1>
          </motion.div>

          {/* Avatar — overlaps header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center -mt-12 mb-6 px-8"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Drop zone ring */}
              <motion.div
                animate={{ borderColor: dragOver ? '#c9a96e' : 'transparent' }}
                className="w-24 h-24 rounded-full border-2 border-dashed"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="w-full h-full rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {photo ? (
                      <motion.img
                        key="photo"
                        src={photo}
                        alt="avatar"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Edit button */}
              <motion.button
                whileHover={{ scale: 1.15, backgroundColor: '#c9a96e' }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400 }}
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-gray-900 rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-md"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </motion.button>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-3 text-[10px] text-gray-300 tracking-wide"
            >
              Drag & drop or click pencil to update
            </motion.p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handlePhoto(e.target.files[0])} />
          </motion.div>

          {/* ── FORM ── */}
          <div className="px-8 pb-8 space-y-4">

            {/* Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1.5">
                Full Name
              </label>
              <motion.div
                animate={{
                  boxShadow: nameFocused
                    ? '0 0 0 3px rgba(15,15,15,0.08)'
                    : '0 0 0 0px rgba(15,15,15,0)',
                }}
                transition={{ duration: 0.2 }}
                className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 focus-within:border-gray-800 focus-within:bg-white transition-colors duration-200"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 text-sm text-gray-800 bg-transparent outline-none"
                />
              </motion.div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 7L2 7" />
                </svg>
                <span className="text-sm text-gray-300 flex-1 truncate">
                  {user?.email || '—'}
                </span>
                <span className="text-[9px] tracking-widest text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                  READ ONLY
                </span>
              </div>
            </motion.div>

            {/* Account created */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-xs text-gray-400">
                  Member since&nbsp;
                  <strong className="text-gray-600 font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                      : '—'}
                  </strong>
                </span>
              </div>
            </motion.div>

            {/* Save button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                onClick={handleSave}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-full py-3.5 rounded-2xl text-sm font-medium tracking-wide cursor-pointer disabled:cursor-not-allowed overflow-hidden relative"
                style={{ background: '#0f0f0f', color: '#fff' }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Saving...
                    </motion.span>
                  ) : saved ? (
                    <motion.span
                      key="saved"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      ✓ Changes Saved
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      Save Changes
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

          </div>
        </div>

      </motion.div>
    </div>
  )
}

export default MyProfile