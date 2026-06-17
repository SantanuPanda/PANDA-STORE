import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Cart = () => {
  const navigate = useNavigate()
  const { products, currency, cartItems, Updatequantity } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (let key in cartItems) {
        for (let size in cartItems[key]) {
          if (cartItems[key][size] > 0) {
            tempData.push({
              _id: key,
              size,
              quantity: cartItems[key][size],
              ...products.find(p => p._id === key),
            })
          }
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products])

  const handleRemove = (id, size) => {
    setRemovingId(`${id}-${size}`)
    setTimeout(() => {
      Updatequantity(id, size, 0)
      setRemovingId(null)
    }, 350)
  }

  // Empty cart
  if (cartData.length === 0) {
    return (
      <div className="border-t border-gray-100 min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280 }}
          className="text-6xl"
        >
          🛍️
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-gray-400 text-sm tracking-wide"
        >
          Your cart is empty
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/collection')}
          className="px-7 py-3 bg-[#0f0f0f] text-white text-xs tracking-[0.15em] uppercase rounded-2xl cursor-pointer"
        >
          Shop Now
        </motion.button>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-100 pt-12 pb-20 px-0">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between mb-8"
      >
        <div className="text-2xl sm:text-3xl">
          <Title text1="YOUR" text2="CART" />
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
          className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full"
        >
          {cartData.length} {cartData.length === 1 ? 'item' : 'items'}
        </motion.span>
      </motion.div>

      {/* Column headers — desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden sm:grid grid-cols-[3fr_1fr_1fr_40px] gap-4 text-[10px] tracking-[0.18em] uppercase text-gray-300 pb-3 border-b border-gray-100 mb-2"
      >
        <span>Product</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Subtotal</span>
        <span />
      </motion.div>

      {/* Cart items */}
      <div className="divide-y divide-gray-50">
        <AnimatePresence>
          {cartData.map((item, index) => {
            const productData = products.find(p => p._id === item._id)
            const key = `${item._id}-${item.size}`
            const isRemoving = removingId === key

            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: isRemoving ? 0 : 1, x: isRemoving ? 40 : 0, y: 0 }}
                exit={{ opacity: 0, x: 40, height: 0 }}
                transition={{
                  layout: { duration: 0.3 },
                  default: { delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                }}
                className="grid grid-cols-[3fr_1fr_40px] sm:grid-cols-[3fr_1fr_1fr_40px] items-center gap-4 py-5"
              >
                {/* Product */}
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0"
                  >
                    <img
                      src={productData.image[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-sm text-gray-700 font-medium">
                        {currency}{item.price}
                      </span>
                      <span className="text-[10px] tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                        {item.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-1 sm:justify-center">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => item.quantity > 1 && Updatequantity(item._id, item.size, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 text-sm flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </motion.button>
                  <motion.span
                    key={item.quantity}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                    className="w-7 text-center text-sm font-medium text-gray-800"
                  >
                    {item.quantity}
                  </motion.span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => item.quantity < 5 && Updatequantity(item._id, item.size, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 text-sm flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-30"
                    disabled={item.quantity >= 5}
                  >
                    +
                  </motion.button>
                </div>

                {/* Subtotal — desktop only */}
                <p className="hidden sm:block text-right text-sm font-semibold text-gray-900">
                  {currency}{(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Delete */}
                <motion.button
                  whileHover={{ scale: 1.1, color: '#ef4444' }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleRemove(item._id, item.size)}
                  className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-red-50 hover:border-red-100 transition-colors ml-auto"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </motion.button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-end mt-14"
      >
        <div className="w-full sm:max-w-sm">

          {/* Cart total card */}
          <div className="bg-[#8e8b1e] rounded-3xl p-6 mb-4 relative overflow-hidden">
            <div className="absolute top-[-30%] right-[-10%] w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none"
              style={{ background: '#c9a96e' }} />
            <div className="relative z-10">
              <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-4">Order Summary</p>
              <CartTotal />
            </div>
          </div>

          {/* Checkout button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400 }}
            onClick={() => navigate('/placeorder')}
            className="w-full py-4 bg-[#0f0f0f] text-white rounded-2xl text-xs tracking-[0.2em] uppercase font-medium cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Proceed to Checkout →
          </motion.button>

          {/* Continue shopping */}
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => navigate('/collection')}
            className="w-full mt-3 py-3 text-xs text-gray-400 tracking-wide cursor-pointer hover:text-gray-700 transition-colors text-center"
          >
            ← Continue Shopping
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Cart