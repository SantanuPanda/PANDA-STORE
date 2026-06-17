import React, { useEffect, useRef, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useContext } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const LatestCollection = () => {
  const Navigate=useNavigate();
  const [latestProducts, setLatestProducts] = useState([]);
  const { products } = useContext(ShopContext);

 /* this is USe in farmer-motion*/
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-60px" });

  /*this is for UI*/
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Men', 'Women', 'Kids'];
  const filtered = activeFilter === 'All'
    ? latestProducts
    : latestProducts.filter(p => p.category === activeFilter);
  /*this is end of UI*/

  

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  

  return (
    <section className="my-20 px-2">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-black text-white text-[10px] tracking-[0.22em] uppercase px-4 py-1.5 rounded-full mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          New Arrivals
        </motion.div>

        <div className="text-3xl sm:text-4xl">
          <Title text1="LATEST" text2="COLLECTION" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-3 w-3/4 mx-auto text-xs sm:text-sm text-gray-400 leading-relaxed"
        >
          Fresh styles, just dropped. Explore our newest arrivals before they're gone.
        </motion.p>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeInOut" }}
          className="mt-5 mx-auto w-10 h-0.5 bg-black rounded-full origin-center"
        />
      </motion.div>

      {/* Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center gap-2 mb-10 flex-wrap"
      >
        {filters.map((f) => (
          <motion.button
            key={f}
            onClick={() => setActiveFilter(f)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
            className={`px-5 py-1.5 rounded-full text-xs tracking-[0.12em] uppercase border transition-all duration-200 cursor-pointer ${
              activeFilter === f
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'
            }`}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      {/* Product Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8"
      >
        {filtered.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.55,
              delay: index * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -5 }}
            layout
          >
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center mt-14"
      >
        <motion.button
          whileHover={{ scale: 1.04, backgroundColor: "#1a1a1a" }}
          whileTap={{ scale: 0.97 }}
          onClick={()=> Navigate("/collection")}
          transition={{ type: "spring", stiffness: 350 }}
          className="px-10 py-3 bg-black text-white text-xs tracking-[0.18em] uppercase rounded-full cursor-pointer"
        >
          View All Collection
        </motion.button>
      </motion.div>

    </section>
  )
}

export default LatestCollection