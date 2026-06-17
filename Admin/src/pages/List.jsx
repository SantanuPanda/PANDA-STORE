import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence, useInView } from "framer-motion";

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [filterCat, setFilterCat] = useState("All");

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products/getallproducts`);
      setList(response.data.products);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setDeletingId(id);
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/products/deleteproduct`, {
        data: { id },
        withCredentials: true,
      });
      if (response.data.status === "success") {
        toast.success("Product deleted");
        await fetchList();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const categories = ["All", ...new Set(list.map(p => p.category))];

  const filtered = list.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || item.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-4 sm:p-8 flex-1 min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase mb-1">Catalogue</p>
          <h1 className="text-2xl font-semibold text-gray-900">All Products</h1>
        </div>

        <div className="flex items-center gap-3">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="text-xs bg-[#0f0f0f] text-white px-3 py-1.5 rounded-full"
          >
            {list.length} items
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={fetchList}
            className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-xl hover:border-gray-400 transition-colors cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Search + Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        {/* Search */}
        <div className="flex items-center gap-2.5 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-gray-800 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-300 bg-transparent"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400 }}
                onClick={() => setSearch("")}
                className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
              >
                <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="1" x2="9" y2="9" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="9" y1="1" x2="1" y2="9" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs tracking-wide border transition-all duration-200 cursor-pointer ${
                filterCat === cat
                  ? "bg-[#0f0f0f] text-white border-[#0f0f0f]"
                  : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden"
      >

        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[72px_1fr_120px_100px_80px] items-center px-6 py-3.5 border-b border-gray-50 bg-gray-50/80">
          {["Image", "Product", "Category", "Price", "Action"].map((h, i) => (
            <p key={h} className={`text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 ${i === 4 ? "text-center" : ""}`}>{h}</p>
          ))}
        </div>

        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded w-1/2" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-16 hidden md:block" />
                  <div className="h-3 bg-gray-100 rounded w-12" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-3"
          >
            <span className="text-5xl">📭</span>
            <p className="text-sm text-gray-400 tracking-wide">No products found</p>
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-gray-400 underline cursor-pointer">
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {/* Rows */}
        {!loading && (
          <div className="divide-y divide-gray-50">
            <AnimatePresence>
              {filtered.map((item, index) => (
                <ProductRow
                  key={item._id}
                  item={item}
                  index={index}
                  deletingId={deletingId}
                  confirmId={confirmId}
                  setConfirmId={setConfirmId}
                  deleteProduct={deleteProduct}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
              onClick={() => setConfirmId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
            >
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
                <div className="text-4xl mb-4">🗑️</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Product?</h3>
                <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setConfirmId(null)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => deleteProduct(confirmId)}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    {deletingId === confirmId ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                        Deleting...
                      </span>
                    ) : "Delete"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

const ProductRow = ({ item, index, deletingId, confirmId, setConfirmId, deleteProduct }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const isDeleting = deletingId === item._id;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, x: 40 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-[56px_1fr_auto] md:grid-cols-[72px_1fr_120px_100px_80px] items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors duration-200 ${isDeleting ? "opacity-40" : ""}`}
    >
      {/* Image */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 shrink-0"
      >
        <img src={item.image[0]} alt={item.name} className="w-full h-full object-cover" />
      </motion.div>

      {/* Name + sub info */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[10px] tracking-wide text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full md:hidden">
            {item.category}
          </span>
          {item.bestseller && (
            <span className="text-[9px] tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full uppercase">
              ⭐ Bestseller
            </span>
          )}
          {item.sizes && (
            <span className="text-[10px] text-gray-300 hidden sm:block">
              {item.sizes.join(" · ")}
            </span>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="hidden md:block">
        <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
          {item.category}
        </span>
      </div>

      {/* Price */}
      <p className="text-sm font-bold text-gray-900">₹{item.price}</p>

      {/* Delete */}
      <div className="flex justify-end md:justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setConfirmId(item._id)}
          disabled={isDeleting}
          className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center cursor-pointer hover:bg-red-500 hover:border-red-500 group transition-all duration-200 disabled:opacity-30"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="text-red-400 group-hover:text-white transition-colors">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default List;