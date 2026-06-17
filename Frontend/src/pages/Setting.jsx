import { THEMES } from "../constants";
import { useThemeStore } from "../context/useThemeStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Mock product data for preview
const PREVIEW_PRODUCTS = [
  { name: "Linen Shirt", price: "₹1,299", badge: "New" },
  { name: "Classic Tee", price: "₹799", badge: "Sale" },
];

const Settingpage = () => {
  const { theme, setTheme } = useThemeStore();
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [activePreview, setActivePreview] = useState(theme);

  const handleHover = (t) => { setHoveredTheme(t); setActivePreview(t); };
  const handleLeave = () => { setHoveredTheme(null); setActivePreview(theme); };

  return (
    <div className="min-h-screen bg-base-200 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[10px] tracking-[0.22em] uppercase px-4 py-1.5 rounded-full mb-5 border border-primary/20"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              🎨
            </motion.span>
            Store Appearance
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-base-content mb-3 leading-tight"
          >
            Personalize Your{" "}
            <span className="relative inline-block">
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Store Theme
              </span>
              <motion.span
                className="absolute bottom-0 left-0 h-[2.5px] bg-linear-to-r from-primary to-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base-content/50 text-sm max-w-md mx-auto"
          >
            Hover any theme to preview how your store will look — then apply it instantly.
          </motion.p>
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-7 items-start">

          {/* ── THEME GRID ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 bg-base-100 rounded-3xl border border-base-300/40 shadow-lg p-6 sm:p-8"
          >
            {/* Panel header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                🖌️
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-base-content/40 uppercase">Step 1</p>
                <p className="text-sm font-semibold text-base-content">Choose a Theme</p>
              </div>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="ml-auto text-xs text-base-content/30 bg-base-200 px-3 py-1 rounded-full"
              >
                {THEMES.length} available
              </motion.span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-3 gap-3">
              {THEMES.map((t, index) => {
                const isActive = theme === t;
                const isHovered = hoveredTheme === t;

                return (
                  <motion.button
                    key={t}
                    initial={{ opacity: 0, y: 14, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.25 + index * 0.025, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -5, scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => handleHover(t)}
                    onHoverEnd={handleLeave}
                    onClick={() => { setTheme(t); setActivePreview(t); }}
                    data-theme={t}
                    className={`relative flex flex-col items-center gap-2.5 p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
                      isActive
                        ? "border-primary shadow-md shadow-primary/10"
                        : "border-base-300/40 hover:border-primary/40"
                    }`}
                  >
                    {/* Active check */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 500 }}
                          className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center z-10 shadow"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Color swatches */}
                    <div className="w-full h-10 rounded-xl overflow-hidden flex gap-1 p-1 bg-base-200">
                      {["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"].map((c, i) => (
                        <motion.div
                          key={i}
                          className={`flex-1 rounded-lg ${c}`}
                          animate={(isHovered || isActive) ? { scaleY: [1, 1.2, 1] } : {}}
                          transition={{ delay: i * 0.04, duration: 0.3 }}
                        />
                      ))}
                    </div>

                    <span className={`text-[10px] font-semibold tracking-wide truncate w-full text-center transition-colors ${
                      isActive ? "text-primary" : "text-base-content/50"
                    }`}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── LIVE STORE PREVIEW ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full xl:w-100 sticky top-20 flex flex-col gap-4"
          >
            <div className="bg-base-100 rounded-3xl border border-base-300/40 shadow-lg overflow-hidden">

              {/* Preview panel header */}
              <div className="px-6 py-4 border-b border-base-300/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                  🛍️
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-base-content/40 uppercase">Step 2</p>
                  <p className="text-sm font-semibold text-base-content">Store Preview</p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activePreview}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full"
                  >
                    {activePreview}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* ── MOCK STORE UI ── */}
              <div data-theme={activePreview} className="transition-all duration-300">
                <div className="bg-base-100">

                  {/* Mock Navbar */}
                  <div className="bg-base-100 border-b border-base-300/30 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-primary" />
                      <span className="text-xs font-black text-base-content tracking-tight">FOREVER</span>
                      <span className="text-primary text-xs">.</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-[9px] text-base-content/50 tracking-widest uppercase">
                      {["Home", "Shop", "About"].map(l => (
                        <span key={l} className="cursor-pointer hover:text-primary transition-colors">{l}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-base-200 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      </div>
                      <div className="relative">
                        <div className="w-5 h-5 rounded-full bg-base-200 flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-[6px] text-primary-content font-bold">2</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Hero Banner */}
                  <div className="bg-base-200 px-5 py-6 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-[8px] tracking-[0.2em] text-base-content/40 uppercase mb-1.5">New Season</div>
                      <div className="text-base font-bold text-base-content leading-tight mb-2">Latest<br/>Arrivals</div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-1 bg-primary text-primary-content text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full cursor-pointer font-semibold"
                      >
                        Shop Now →
                      </motion.div>
                    </div>
                    <div className="w-20 h-20 rounded-2xl bg-base-300 flex items-center justify-center text-2xl shrink-0">
                      👗
                    </div>
                  </div>

                  {/* Mock Product Grid */}
                  <div className="px-4 py-4">
                    <div className="text-[9px] tracking-[0.18em] text-base-content/40 uppercase mb-3 font-semibold">
                      Best Sellers
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {PREVIEW_PRODUCTS.map((product, i) => (
                        <motion.div
                          key={`${activePreview}-${i}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.3 }}
                          className="bg-base-200 rounded-2xl overflow-hidden border border-base-300/30"
                        >
                          <div className="relative h-20 bg-base-300 flex items-center justify-center">
                            <span className="text-3xl">{i === 0 ? "👔" : "👕"}</span>
                            <div className="absolute top-1.5 left-1.5 bg-primary text-primary-content text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                              {product.badge}
                            </div>
                          </div>
                          <div className="p-2.5">
                            <p className="text-[10px] font-semibold text-base-content truncate">{product.name}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-[10px] font-bold text-primary">{product.price}</p>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-5 h-5 rounded-full bg-primary flex items-center justify-center cursor-pointer"
                              >
                                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                                  <line x1="5" y1="1" x2="5" y2="9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                                  <line x1="1" y1="5" x2="9" y2="5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Mock Footer strip */}
                  <div className="bg-base-300/40 px-4 py-2.5 flex items-center justify-between border-t border-base-300/30">
                    <span className="text-[8px] text-base-content/30">© 2026 Forever.</span>
                    <div className="flex gap-1.5">
                      {["bg-primary", "bg-secondary", "bg-accent"].map((c, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${c} opacity-60`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply button */}
              <div className="px-5 py-4 border-t border-base-300/20">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme(activePreview)}
                  className="w-full py-3 rounded-2xl text-xs tracking-[0.18em] uppercase font-semibold cursor-pointer bg-primary text-primary-content hover:opacity-90 transition-opacity"
                >
                  <AnimatePresence mode="wait">
                    {theme === activePreview ? (
                      <motion.span key="applied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2">
                        ✓ Theme Applied
                      </motion.span>
                    ) : (
                      <motion.span key="apply" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Apply "{activePreview}"
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Tip card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-base-100 rounded-2xl border border-base-300/30 p-4 flex items-start gap-3"
            >
              <span className="text-lg shrink-0">💡</span>
              <p className="text-xs text-base-content/40 leading-relaxed">
                Hover a theme to preview it in your store. When you're happy, click <strong className="text-base-content/60">Apply</strong> to save.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Settingpage;