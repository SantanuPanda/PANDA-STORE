import React, { useContext, useEffect, useState, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const Collection = () => {
  const { products, search, showsearch } = useContext(ShopContext)
  const [showFilters, setShowFilters] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relavent')
  const gridRef = useRef(null)
  const isInView = useInView(gridRef, { once: false, margin: '-40px' })

  const categories = ['Men', 'Women', 'Kids']
  const subCategories = ['Topwear', 'Bottomwear', 'Winterwear']

  const toggleCategory = (val) => {
    setCategory(prev =>
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    )
  }

  const toggleSubCategory = (val) => {
    setSubCategory(prev =>
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    )
  }

  const applyfilters = () => {
    let copy = products.slice()
    if (category.length > 0) copy = copy.filter(i => category.includes(i.category))
    if (subCategory.length > 0) copy = copy.filter(i => subCategory.includes(i.subCategory))
    if (showsearch && search) copy = copy.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    setFilteredProducts(copy)
  }

  const sortProducts = () => {
    let copy = filteredProducts.slice()
    switch (sortType) {
      case 'low-high': setFilteredProducts(copy.sort((a, b) => a.price - b.price)); break
      case 'high-low': setFilteredProducts(copy.sort((a, b) => b.price - a.price)); break
      default: applyfilters(); break
    }
  }

  useEffect(() => { applyfilters() }, [category, subCategory, search, showsearch, products])
  useEffect(() => { sortProducts() }, [sortType])

  const activeFilterCount = category.length + subCategory.length

  return (
    <div className="pt-10 border-t border-gray-100">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <Title text1="ALL" text2="COLLECTION" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
            className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full"
          >
            {filteredProducts.length} items
          </motion.span>
        </div>

        {/* Sort */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="relative"
        >
          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            className="appearance-none border border-gray-200 bg-white text-xs text-gray-600 px-4 py-2.5 pr-8 rounded-xl outline-none cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="relavent">Sort: Relevant</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">

        {/* ── SIDEBAR FILTERS ── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full sm:min-w-50 sm:max-w-55"
        >

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(p => !p)}
            className="sm:hidden w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white mb-2 cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-black text-white text-[9px] rounded-full flex items-center justify-center"
                >
                  {activeFilterCount}
                </motion.span>
              )}
            </div>
            <motion.img
              src={assets.dropdown_icon}
              alt="toggle"
              className="h-3"
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>

          {/* Filter panels */}
          <AnimatePresence>
            {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 640) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="sm:opacity-100 sm:h-auto overflow-hidden"
              >
                <div className="space-y-4 pt-1 sm:pt-0">

                  {/* Active filter chips */}
                  <AnimatePresence>
                    {activeFilterCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-1.5 pb-1"
                      >
                        {[...category, ...subCategory].map(f => (
                          <motion.span
                            key={f}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            className="flex items-center gap-1 text-[10px] bg-black text-white px-2.5 py-1 rounded-full cursor-pointer"
                            onClick={() =>
                              categories.includes(f) ? toggleCategory(f) : toggleSubCategory(f)
                            }
                          >
                            {f}
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                              <line x1="1" y1="1" x2="9" y2="9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                              <line x1="9" y1="1" x2="1" y2="9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          </motion.span>
                        ))}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setCategory([]); setSubCategory([]) }}
                          className="text-[10px] text-gray-400 hover:text-gray-700 underline cursor-pointer"
                        >
                          Clear all
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category */}
                  <FilterPanel title="CATEGORIES">
                    {categories.map((c, i) => (
                      <FilterCheckbox
                        key={c} label={c} value={c}
                        checked={category.includes(c)}
                        onChange={() => toggleCategory(c)}
                        delay={i * 0.05}
                      />
                    ))}
                  </FilterPanel>

                  {/* Sub-category */}
                  <FilterPanel title="TYPE">
                    {subCategories.map((s, i) => (
                      <FilterCheckbox
                        key={s} label={s} value={s}
                        checked={subCategory.includes(s)}
                        onChange={() => toggleSubCategory(s)}
                        delay={i * 0.05}
                      />
                    ))}
                  </FilterPanel>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── PRODUCT GRID ── */}
        <div className="flex-1">
          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0
                ? filteredProducts.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index * 0.05, 0.4),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                  </motion.div>
                ))
                : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full flex flex-col items-center justify-center py-24 text-center gap-4"
                  >
                    <div className="text-5xl">🔍</div>
                    <p className="text-gray-400 text-sm">No products match your filters.</p>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => { setCategory([]); setSubCategory([]) }}
                      className="text-xs px-5 py-2.5 bg-black text-white rounded-full cursor-pointer"
                    >
                      Clear Filters
                    </motion.button>
                  </motion.div>
                )
              }
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Sub-components ──

const FilterPanel = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="border border-gray-100 rounded-2xl px-4 py-4 bg-white"
  >
    <p className="text-[10px] tracking-[0.18em] font-semibold text-gray-400 uppercase mb-3">{title}</p>
    <div className="flex flex-col gap-2">{children}</div>
  </motion.div>
)

const FilterCheckbox = ({ label, checked, onChange, delay }) => (
  <motion.label
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="flex items-center gap-2.5 cursor-pointer group"
    onClick={onChange}
  >
    <motion.div
      animate={{
        background: checked ? '#0f0f0f' : '#fff',
        borderColor: checked ? '#0f0f0f' : '#d1d5db',
        scale: checked ? [1, 1.2, 1] : 1,
      }}
      transition={{ duration: 0.2 }}
      className="w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0"
    >
      {checked && (
        <motion.svg
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0 }}
          width="9" height="9" viewBox="0 0 10 10" fill="none"
        >
          <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      )}
    </motion.div>
    <span className={`text-sm transition-colors ${checked ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-800'}`}>
      {label}
    </span>
  </motion.label>
)

export default Collection