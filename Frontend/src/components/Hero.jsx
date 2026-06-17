import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    tag: "SS — 2026",
    heading: "LATEST\nARRIVALS",
    sub: "Fresh drops daily. Be first.",
    cta: "Shop Now",
    accent: "#c9a96e",
    num: "01",
    img: assets.hero_img,   // 👈 each slide has its own image
  },
  {
    tag: "COMMUNITY",
    heading: "MOST\nLOVED",
    sub: "Curated favourites. All time.",
    cta: "Explore",
    accent: "#6e9ec9",
    num: "02",
    img: assets.hero_img1,  // 👈
  },
  {
    tag: "LIMITED",
    heading: "EXCLUSIVE\nDROPS",
    sub: "Rare pieces. Gone forever.",
    cta: "Grab Yours",
    accent: "#c96e8a",
    num: "03",
    img: assets.hero_img2,  // 👈
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => advance(), 5500);
    return () => clearInterval(t);
  }, [current, animating]);

  const advance = () => {
    if (animating) return;
    setAnimating(true);
    setCurrent((p) => (p + 1) % slides.length);
    setTimeout(() => setAnimating(false), 900);
  };

  const goTo = (i) => {
    if (i === current || animating) return;
    setAnimating(true);
    setCurrent(i);
    setTimeout(() => setAnimating(false), 900);
  };

  const s = slides[current];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl"
      style={{ height: "92vh", background: "#0d0d0d" }}
    >

      {/* ── BACKGROUND IMAGE — single AnimatePresence ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}                           // 👈 unique key per slide
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={s.img}                           // 👈 use slide's own image
            alt="hero"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── ACCENT COLOR WASH ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current + "-wash"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.10 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-1 pointer-events-none"
          style={{ background: s.accent }}
        />
      </AnimatePresence>

      {/* ── GIANT BG NUMBER ── */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 select-none pointer-events-none hidden sm:block overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={current + "-num"}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 0.05, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-white font-black"
            style={{ fontSize: "22vw", lineHeight: 1, letterSpacing: "-0.05em" }}
          >
            {s.num}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── MAIN TEXT CONTENT ── */}
      <div className="relative z-20 h-full flex flex-col justify-end sm:justify-center px-8 sm:px-16 lg:px-24 pb-32 sm:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current + "-content"}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >

            {/* Tag line */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex items-center gap-3 mb-6"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ delay: 0.15, duration: 0.45 }}
                className="h-px shrink-0"
                style={{ background: s.accent }}
              />
              <span
                className="text-[10px] tracking-[0.35em] font-bold uppercase"
                style={{ color: s.accent }}
              >
                {s.tag}
              </span>
            </motion.div>

            {/* Heading lines */}
            <div className="mb-6 overflow-hidden">
              {s.heading.split("\n").map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.15 + i * 0.1,
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-white font-black block"
                    style={{
                      fontSize: "clamp(2rem, 7vw, 6rem)",
                      letterSpacing: "0.1em",
                      lineHeight: 0.95,
                    }}
                  >
                    {line}
                  </motion.h1>
                </div>
              ))}
            </div>

            {/* Sub text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-white/50 text-sm sm:text-base mb-10 max-w-xs leading-relaxed"
            >
              {s.sub}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="flex items-center gap-5"
            >
              <motion.button
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/collection")}
                className="px-8 py-4 text-[11px] tracking-[0.22em] uppercase font-bold rounded-2xl cursor-pointer text-black"
                style={{ background: s.accent }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {s.cta}
              </motion.button>

              <motion.button
                whileHover={{ x: 6 }}
                onClick={() => navigate("/collection")}
                className="flex items-center gap-2.5 text-[11px] tracking-[0.18em] uppercase text-white/40 hover:text-white/80 transition-colors cursor-pointer"
              >
                View All
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.button>
            </motion.div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── RIGHT VERTICAL SLIDE NAV ── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="cursor-pointer">
            <motion.div
              animate={{
                height: i === current ? 40 : 14,
                opacity: i === current ? 1 : 0.3,
                backgroundColor: i === current ? s.accent : "#ffffff",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="w-0.5 rounded-full"
            />
          </button>
        ))}
      </div>

      {/* ── BOTTOM HUD BAR ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10">
        <div className="flex items-center justify-between px-8 sm:px-16 lg:px-24 py-5">

          {/* Dot indicators */}
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="cursor-pointer">
                <motion.div
                  animate={{
                    width: i === current ? 28 : 6,
                    opacity: i === current ? 1 : 0.25,
                    backgroundColor: i === current ? s.accent : "#ffffff",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="h-0.5 rounded-full"
                />
              </button>
            ))}
            <span className="text-white/25 text-[10px] tracking-widest ml-2">
              {s.num} / 03
            </span>
          </div>

          {/* Scroll bounce */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="hidden sm:flex flex-col items-center gap-1.5 cursor-pointer"
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
          >
            <span className="text-[9px] tracking-[0.28em] text-white/25 uppercase">Scroll</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </motion.div>

          {/* Feature pills */}
          <div className="hidden md:flex items-center gap-5">
            {[{ icon: "🚚", label: "Free Shipping" }, { icon: "↩", label: "Easy Returns" }].map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <span className="text-sm">{f.icon}</span>
                <span className="text-[10px] text-white/30 tracking-wide">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FROSTED GLASS CARD ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current + "-card"}
          initial={{ opacity: 0, x: 30, y: "-50%" }}
          animate={{ opacity: 1, x: 0, y: "-50%" }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 right-16 z-20 hidden xl:block"
          style={{ transform: "translateY(-50%)" }}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/15 w-52 shadow-2xl">
            <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 bg-white/5">
              <img
                src={s.img}                       // 👈 matches current slide image
                alt="featured"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <p className="text-[9px] tracking-[0.2em] text-white/30 uppercase mb-1">Featured Pick</p>
            <p className="text-sm font-bold text-white mb-3">New Collection '26</p>
            <div className="flex items-center gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.06, type: "spring", stiffness: 400 }}
                  className="text-xs"
                  style={{ color: s.accent }}
                >★</motion.span>
              ))}
              <span className="text-[10px] text-white/30 ml-1.5">4.9 (2.3k)</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.04, opacity: 0.9 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/collection")}
              className="w-full py-2.5 rounded-xl text-[10px] tracking-[0.18em] uppercase font-bold cursor-pointer text-black"
              style={{ background: s.accent }}
            >
              Shop Now
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default Hero;