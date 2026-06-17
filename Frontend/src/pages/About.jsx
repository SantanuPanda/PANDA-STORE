import React, { useRef } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { motion, useInView } from "framer-motion";

const stats = [
  { number: "50K+", label: "Happy Customers" },
  { number: "200+", label: "Brands" },
  { number: "99%", label: "Satisfaction" },
  { number: "24/7", label: "Support" },
];

const whyCards = [
  {
    icon: "🏅",
    title: "Quality Assurance",
    desc: "We meticulously select and vet each product to ensure it meets our stringent quality standards.",
    accent: "#fef3e2",
    dot: "#f5a623",
  },
  {
    icon: "⚡",
    title: "Convenience",
    desc: "With our user-friendly interface and hassle-free ordering process, shopping has never been easier.",
    accent: "#e8f4f0",
    dot: "#4caf8f",
  },
  {
    icon: "💬",
    title: "Exceptional Support",
    desc: "Our dedicated team is here every step of the way, ensuring your satisfaction is our top priority.",
    accent: "#f0e8f4",
    dot: "#a87ec9",
  },
];

const About = () => {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });

  return (
    <div className="border-t border-gray-100 overflow-hidden">

      {/* ── HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center pt-14 pb-4 px-4"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-[10px] tracking-[0.22em] uppercase px-4 py-1.5 rounded-full mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Our Story
        </motion.span>
        <div className="text-3xl sm:text-4xl">
          <Title text1="ABOUT" text2="US" />
        </div>
      </motion.div>

      {/* ── STORY SECTION ── */}
      <div className="my-12 flex flex-col md:flex-row items-center gap-10 lg:gap-16 px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 relative"
        >
          <div className="rounded-3xl overflow-hidden">
            <img
              src={assets.about_img}
              alt="about"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -bottom-4 -right-2 sm:bottom-6 sm:right-6 bg-white rounded-2xl px-5 py-3 shadow-xl border border-gray-50"
          >
            <p className="text-[9px] tracking-[0.18em] text-gray-400 uppercase mb-0.5">Est.</p>
            <p className="text-xl font-bold text-gray-900">2026</p>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 flex flex-col gap-5 text-gray-500 text-sm sm:text-base leading-relaxed pt-6 sm:pt-0"
        >
          <p>
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>
          <p>
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference — from fashion and beauty to electronics and home essentials.
          </p>

          {/* Mission block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 mt-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🎯</span>
              <p className="text-sm font-semibold text-gray-800 tracking-wide">Our Mission</p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              To empower customers with choice, convenience, and confidence — delivering a seamless shopping
              experience that exceeds expectations, from browsing to delivery and beyond.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── STATS ── */}
      <div
        ref={statsRef}
        className="my-20 px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0f0f0f] rounded-2xl px-6 py-8 text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.number}</p>
              <p className="text-[10px] tracking-[0.18em] text-gray-500 uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl mx-auto mb-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-[10px] tracking-[0.22em] uppercase px-4 py-1.5 rounded-full mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            The Forever Difference
          </motion.span>
          <div className="text-2xl sm:text-3xl">
            <Title text1="WHY" text2="CHOOSE US" />
          </div>
        </motion.div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {whyCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(0,0,0,0.07)" }}
              className="relative rounded-3xl border border-gray-100 bg-white px-8 py-10 flex flex-col gap-4 overflow-hidden cursor-default transition-shadow duration-300"
            >
              {/* Accent bg on hover */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
                style={{ background: card.accent }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2"
                  style={{ background: card.accent }}
                >
                  {card.icon}
                </motion.div>

                <b className="text-gray-900 text-base block mb-1">{card.title}</b>

                {/* Accent underline */}
                <motion.div
                  className="h-0.5 rounded-full mb-3"
                  style={{ background: card.dot }}
                  initial={{ width: 0 }}
                  animate={cardsInView ? { width: 32 } : {}}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
                />

                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;