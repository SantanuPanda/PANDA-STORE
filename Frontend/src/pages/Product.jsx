// Product.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Relatedproducts from '../components/Relatedproducts'
import { motion, AnimatePresence } from 'framer-motion'

const Product = () => {
  const { id } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    const found = products.find(item => item._id === id)
    if (found) {
      setProductData(found)
      setImage(found.image[0])
      setSize('')
      setAdded(false)
    }
  }, [id, products])

  const handleAddToCart = () => {
    addToCart(productData._id, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const perks = [
    { icon: '✓', text: '100% Original product' },
    { icon: '🚚', text: 'Cash on delivery available' },
    { icon: '↩', text: 'Easy 7-day return policy' },
  ]

  if (!productData) return <div className="min-h-screen" />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="border-t border-gray-100 pt-10"
    >

      {/* ── TOP SECTION ── */}
      <div className="flex flex-col sm:flex-row gap-10 sm:gap-14">

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col-reverse sm:flex-row gap-3"
        >
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-[18%] w-full">
            {productData.image.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setImage(img)}
                className={`shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  image === img ? 'border-gray-800' : 'border-transparent'
                }`}
              >
                <img
                  src={img}
                  alt={`view-${i}`}
                  className="w-16 sm:w-full h-16 sm:h-auto object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 rounded-2xl overflow-hidden bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.img
                key={image}
                src={image}
                alt={productData.name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col"
        >
          {/* Category badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="inline-flex w-fit items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            {productData.category} · {productData.subCategory}
          </motion.span>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug mb-3"
          >
            {productData.name}
          </motion.h1>

          {/* Price */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            {currency}{productData.price}
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-px bg-gray-100 mb-4 origin-left"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm text-gray-500 leading-relaxed mb-6 md:w-4/5"
          >
            {productData.description}
          </motion.p>

          {/* Size selector */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="mb-6"
          >
            <p className="text-xs tracking-[0.15em] uppercase text-gray-400 font-medium mb-3">
              Select Size
            </p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05, type: 'spring', stiffness: 350 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSize(s)}
                  className={`w-11 h-11 text-sm font-medium rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    s === size
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
            {!size && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-gray-300 mt-2 tracking-wide"
              >
                Please select a size to continue
              </motion.p>
            )}
          </motion.div>

          {/* Add to Cart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.45 }}
            className="flex gap-3 mb-8"
          >
            <motion.button
              whileHover={{ scale: size ? 1.03 : 1 }}
              whileTap={{ scale: size ? 0.96 : 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              onClick={handleAddToCart}
              disabled={!size}
              className={`flex-1 py-3.5 rounded-2xl text-sm font-medium tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                size
                  ? 'bg-gray-900 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center justify-center gap-2"
                  >
                    ✓ Added to Cart
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Perks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col gap-2.5 border-t border-gray-100 pt-6"
          >
            {perks.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="flex items-center gap-2.5 text-xs text-gray-400"
              >
                <span className="text-sm">{p.icon}</span>
                {p.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── TABS ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-20"
      >
        {/* Tab buttons */}
        <div className="flex gap-1 border-b border-gray-100 mb-6">
          {['details', 'shipping'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-5 py-3 text-sm font-medium capitalize cursor-pointer transition-colors"
              style={{ color: activeTab === tab ? '#1a1a1a' : '#9ca3af' }}
            >
              {tab === 'details' ? 'Product Details' : 'Shipping & Returns'}
              {activeTab === tab && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-500 leading-relaxed space-y-4 max-w-3xl"
          >
            {activeTab === 'details' ? (
              <>
                <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products.</p>
                <p>Products are displayed with detailed descriptions, images, prices, and available variations such as sizes and colors. Each product has its own dedicated page with all relevant information.</p>
              </>
            ) : (
              <>
                <p>We offer free standard shipping on all orders above ₹999. Express delivery available at checkout for an additional charge.</p>
                <p>Returns and exchanges are accepted within 7 days of delivery. Items must be unused and in original packaging. Refunds are processed within 5–7 business days.</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Related Products */}
      <Relatedproducts
        category={productData.category}
        subCategory={productData.subCategory}
      />

    </motion.div>
  )
}

export default Product