import React, { useEffect, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useContext } from 'react'
import { useState } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'
import { motion, useInView } from 'framer-motion'

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSellers, setBestSellers] = useState([]);

  /* this is USe in farmer-motion*/
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-80px" });


  useEffect(() => {
    const bestProduct = products.filter((product) => product.bestseller);
    setBestSellers(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <section className="my-16 px-2">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-400 text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Trending Now
        </motion.div>

        <div className="text-3xl sm:text-4xl">
          <Title text1="BEST" text2="SELLERS" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-3 w-3/4 mx-auto text-xs sm:text-sm text-gray-400 leading-relaxed"
        >
          Handpicked favourites loved by thousands — our most wanted styles, restocked just for you.
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
          className="mt-5 mx-auto w-12 h-0.5 bg-linear-to-r from-rose-300 to-rose-500 rounded-full origin-center"
        />
      </motion.div>

      {/* Product Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8"
      >
        {bestSellers.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.55,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
          >
            {/* Rank badge */}
            <div className="relative">
              {index < 3 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 400 }}
                  className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center shadow-md"
                >
                  #{index + 1}
                </motion.div>
              )}
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default BestSeller