import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-800 focus:bg-white transition-all placeholder-gray-300";

const selectClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-800 focus:bg-white transition-all cursor-pointer appearance-none";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const ImageSlot = ({ id, image, setImage, index }) => (
  <motion.label
    htmlFor={id}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.07, type: "spring", stiffness: 300 }}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="relative cursor-pointer group"
  >
    <div className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 flex items-center justify-center ${
      image ? "border-gray-900 shadow-md" : "border-dashed border-gray-200 bg-gray-50 hover:border-gray-400"
    }`}>
      {image ? (
        <img src={URL.createObjectURL(image)} alt="upload" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-1 text-gray-300">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-[9px] tracking-widest uppercase">Photo {index + 1}</span>
        </div>
      )}

      {/* Overlay on hover when filled */}
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </motion.div>
      )}
    </div>

    {/* Filled indicator */}
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500 }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>

    <input id={id} type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
  </motion.label>
);

const Section = ({ title, icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm"
  >
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
    </div>
    {children}
  </motion.div>
);

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Topwear');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  const toggleSize = (s) =>
    setSizes(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]);

  const resetForm = () => {
    setName(''); setDescription(''); setCategory('Men');
    setSubCategory('Topwear'); setPrice(''); setSizes([]);
    setBestseller(false); setImage1(false); setImage2(false);
    setImage3(false); setImage4(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      const response = await axios.post(`${BACKEND_URL}/api/products/createproduct`, formData, { withCredentials: true });

      if (response.data.success) {
        resetForm();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 flex-1 min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase mb-1">Catalogue</p>
        <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
      </motion.div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col xl:flex-row gap-5 items-start">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-5 w-full xl:flex-1">

            {/* Images */}
            <Section
              title="Product Images"
              delay={0.05}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
              }
            >
              <p className="text-xs text-gray-400 mb-4 tracking-wide">Upload up to 4 product photos. First image will be the cover.</p>
              <div className="flex gap-3 flex-wrap">
                <ImageSlot id="image1" image={image1} setImage={setImage1} index={0} />
                <ImageSlot id="image2" image={image2} setImage={setImage2} index={1} />
                <ImageSlot id="image3" image={image3} setImage={setImage3} index={2} />
                <ImageSlot id="image4" image={image4} setImage={setImage4} index={3} />
              </div>
            </Section>

            {/* Name + Description */}
            <Section
              title="Product Info"
              delay={0.1}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
                </svg>
              }
            >
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-1.5">Product Name</label>
                  <input type="text" placeholder="e.g. Classic White Linen Shirt" required value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-1.5">Description</label>
                  <textarea rows={4} placeholder="Describe the product..." required value={description} onChange={e => setDescription(e.target.value)} className={inputClass + " resize-none"} />
                </div>
              </div>
            </Section>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col gap-5 w-full xl:w-80">

            {/* Category */}
            <Section
              title="Category"
              delay={0.15}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              }
            >
              <div className="flex flex-col gap-3">
                {[
                  { label: "Category", value: category, setter: setCategory, options: ["Men", "Women", "Kids"] },
                  { label: "Sub-Category", value: subCategory, setter: setSubCategory, options: ["Topwear", "Bottomwear", "Winterwear"] },
                ].map(({ label, value, setter, options }) => (
                  <div key={label} className="relative">
                    <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-1.5">{label}</label>
                    <div className="relative">
                      <select value={value} onChange={e => setter(e.target.value)} className={selectClass}>
                        {options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Price */}
            <Section
              title="Pricing"
              delay={0.2}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            >
              <div>
                <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-1.5">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className={inputClass + " pl-8"}
                  />
                </div>
              </div>
            </Section>

            {/* Sizes */}
            <Section
              title="Available Sizes"
              delay={0.25}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
                </svg>
              }
            >
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s, i) => (
                  <motion.button
                    key={s}
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 400 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleSize(s)}
                    className={`w-11 h-11 rounded-xl text-sm font-semibold border-2 transition-all duration-200 cursor-pointer ${
                      sizes.includes(s)
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
              {sizes.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-gray-400 mt-2 tracking-wide"
                >
                  Selected: {sizes.join(", ")}
                </motion.p>
              )}
            </Section>

            {/* Bestseller */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              onClick={() => setBestseller(p => !p)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                bestseller ? "border-gray-900 bg-gray-50" : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <motion.div
                animate={{
                  backgroundColor: bestseller ? "#0f0f0f" : "#fff",
                  borderColor: bestseller ? "#0f0f0f" : "#e5e7eb",
                }}
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0"
              >
                <AnimatePresence>
                  {bestseller && (
                    <motion.svg
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      width="10" height="10" viewBox="0 0 10 10" fill="none"
                    >
                      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.div>
              <div>
                <p className="text-sm font-medium text-gray-800">Mark as Bestseller</p>
                <p className="text-[10px] text-gray-400 tracking-wide">Show in featured section</p>
              </div>
              <span className="ml-auto text-lg">⭐</span>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full py-4 bg-[#0f0f0f] text-white rounded-2xl text-xs tracking-[0.2em] uppercase font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
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
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Publishing...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Publish Product
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default Add;