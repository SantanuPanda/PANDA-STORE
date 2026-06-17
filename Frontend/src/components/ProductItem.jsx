import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Wishlist localStorage helpers ──
const getWishlist = () => {
  try { return JSON.parse(localStorage.getItem("forever_wishlist") || "[]"); }
  catch { return []; }
};
const saveWishlist = (list) => localStorage.setItem("forever_wishlist", JSON.stringify(list));

const SIZES = ["S", "M", "L", "XL"];

const ProductItem = ({ id, image, name, price }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => getWishlist().includes(id));
  const [showSizes, setShowSizes] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [addedMsg, setAddedMsg] = useState(false);

  // Sync across tabs
  useEffect(() => {
    const sync = () => setWishlisted(getWishlist().includes(id));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [id]);

  // Close size picker when mouse leaves card
  useEffect(() => {
    if (!hovered) {
      const t = setTimeout(() => { setShowSizes(false); setSelectedSize(""); }, 300);
      return () => clearTimeout(t);
    }
  }, [hovered]);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const current = getWishlist();
    const updated = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    saveWishlist(updated);
    setWishlisted(!current.includes(id));
  };

  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizes(true);
  };

  const handleSizeSelect = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(id, size);       // ✅ size is passed directly, not from state
    setAddedMsg(true);
    setShowSizes(false);
    setTimeout(() => { setAddedMsg(false); setSelectedSize(""); }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative"
    >
      <Link to={`/product/${id}`} className="block">

        {/* ── IMAGE ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-3/4">

          {/* Main image */}
          <motion.img
            src={image[0]}
            alt={name}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover"
          />

          {/* Second image on hover */}
          {image[1] && (
            <motion.img
              src={image[1]}
              alt={name}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Bottom gradient */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none"
          />

          {/* ── WISHLIST BUTTON ── */}
          <motion.button
            onClick={handleWishlist}
            animate={{
              opacity: hovered || wishlisted ? 1 : 0,
              scale: hovered || wishlisted ? 1 : 0.7,
              y: hovered || wishlisted ? 0 : -8,
            }}
            whileTap={{ scale: 0.82 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md cursor-pointer z-10 border border-white/60"
          >
            <motion.svg
              width="14" height="14" viewBox="0 0 24 24"
              fill={wishlisted ? "#ef4444" : "none"}
              stroke={wishlisted ? "#ef4444" : "#999"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              animate={{ scale: wishlisted ? [1, 1.45, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </motion.svg>
          </motion.button>

          {/* ── SAVED BADGE ── */}
          <AnimatePresence>
            {wishlisted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, x: -6 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="absolute top-3 left-3 bg-red-500 text-white text-[8px] tracking-[0.15em] uppercase font-bold px-2 py-1 rounded-full z-10"
              >
                ♥ Saved
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── BOTTOM ACTION AREA ── */}
          <AnimatePresence mode="wait">

            {/* SIZE PICKER */}
            {showSizes && !addedMsg && (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-3 left-3 right-3 z-10"
                onClick={(e) => e.preventDefault()}
              >
                <div className="bg-black/80 backdrop-blur-md rounded-xl p-2">
                  <p className="text-[8px] tracking-[0.2em] text-white/40 uppercase text-center mb-2">
                    Select Size
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SIZES.map((size) => (
                      <motion.button
                        key={size}
                        onClick={(e) => handleSizeSelect(e, size)}
                        whileHover={{ scale: 1.08, backgroundColor: "#ffffff", color: "#000000" }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="py-1.5 rounded-lg text-[10px] font-bold text-white border border-white/20 cursor-pointer transition-colors"
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ADDED CONFIRMATION */}
            {addedMsg && (
              <motion.div
                key="added"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-3 left-3 right-3 z-10"
              >
                <div className="bg-green-500 rounded-xl py-2.5 flex items-center justify-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-white">
                    Added — Size {selectedSize}
                  </span>
                </div>
              </motion.div>
            )}

            {/* QUICK ADD BUTTON (default) */}
            {!showSizes && !addedMsg && (
              <motion.button
                key="quick-add"
                onClick={handleQuickAddClick}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 14 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-3 left-3 right-3 py-2.5 rounded-xl text-[10px] tracking-[0.18em] uppercase font-bold cursor-pointer text-white z-10"
                style={{ background: "rgba(15,15,15,0.85)", backdropFilter: "blur(10px)" }}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Quick Add
                </span>
              </motion.button>
            )}

          </AnimatePresence>
        </div>

        {/* ── INFO ROW ── */}
        <div className="mt-3 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-1 flex-1">
              {name}
            </p>
            <p className="text-sm font-bold text-gray-900 shrink-0">
              {currency}{price}
            </p>
          </div>

          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1">
              {["#d4c5b0", "#8b8b8b", "#2c2c2c"].map((c, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.35 }}
                  className="w-2.5 h-2.5 rounded-full border border-white shadow-sm cursor-pointer"
                  style={{ background: c }}
                />
              ))}
            </div>
            <motion.span
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 4 }}
              transition={{ duration: 0.25 }}
              className="text-[10px] text-gray-400 tracking-wide flex items-center gap-1"
            >
              View
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.span>
          </div>
        </div>

      </Link>
    </motion.div>
  );
};

export default ProductItem;