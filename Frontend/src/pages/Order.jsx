import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { motion, AnimatePresence, useInView } from "framer-motion";

const statusConfig = {
  "Order Placed":     { color: "#3b82f6", bg: "#eff6ff", dot: "#3b82f6", icon: "📦" },
  "Packing":          { color: "#f59e0b", bg: "#fffbeb", dot: "#f59e0b", icon: "📫" },
  "Shipped":          { color: "#8b5cf6", bg: "#f5f3ff", dot: "#8b5cf6", icon: "🚚" },
  "Out for Delivery": { color: "#06b6d4", bg: "#ecfeff", dot: "#06b6d4", icon: "🛵" },
  "Delivered":        { color: "#10b981", bg: "#ecfdf5", dot: "#10b981", icon: "✅" },
  "Cancelled":        { color: "#ef4444", bg: "#fef2f2", dot: "#ef4444", icon: "❌" },
  "Out Of Stock":     { color: "#f97316", bg: "#fff7ed", dot: "#f97316", icon: "⚠️" },
  "Refund initiating":{ color: "#f59e0b", bg: "#fffbeb", dot: "#f59e0b", icon: "↩" },
  "Refund Sucessfull":{ color: "#10b981", bg: "#ecfdf5", dot: "#10b981", icon: "🎉" },
};

const getStatus = (s) => statusConfig[s] || { color: "#10b981", bg: "#ecfdf5", dot: "#10b981", icon: "📦" };

const STEPS = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered"];
const getStepIndex = (status) => STEPS.indexOf(status);

const OrderCard = ({ item, index, currency, onTrack }) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const status = getStatus(item.status);
  const stepIdx = getStepIndex(item.status);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Card top */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 sm:p-6">

        {/* Product image */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0"
        >
          <img src={item.image[0]} alt={item.name} className="w-full h-full object-cover" />
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-900 truncate max-w-xs">
                {item.name}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-sm font-bold text-gray-800">
                  {currency}{item.price}
                </span>
                <span className="text-[10px] tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                  {item.size}
                </span>
                <span className="text-[10px] tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  Qty: {item.quantity}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.15 + index * 0.07, type: "spring", stiffness: 300 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
              style={{ background: status.bg, color: status.color }}
            >
              <span className="text-sm">{status.icon}</span>
              {item.status}
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full ml-0.5"
                style={{ background: status.dot }}
              />
            </motion.div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              {item.paymentMethod}
              {item.payment && (
                <span className="text-green-500 font-medium ml-1">· Paid</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress tracker (only for active orders) */}
      {stepIdx >= 0 && item.status !== "Cancelled" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={inView ? { opacity: 1, height: "auto" } : {}}
          transition={{ delay: 0.25 + index * 0.07, duration: 0.5 }}
          className="px-5 sm:px-6 pb-4 border-t border-gray-50 pt-4"
        >
          <p className="text-[9px] tracking-[0.2em] text-gray-300 uppercase mb-3">Delivery Progress</p>
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => {
              const done = i <= stepIdx;
              const active = i === stepIdx;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 400 }}
                      className="relative w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: done ? "#0f0f0f" : "#f3f4f6",
                        border: active ? "2px solid #0f0f0f" : "none",
                      }}
                    >
                      {active && (
                        <motion.div
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 rounded-full bg-gray-900 opacity-20"
                        />
                      )}
                      {done && !active ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: done ? "#fff" : "#d1d5db" }} />
                      )}
                    </motion.div>
                    <span className="text-[8px] text-gray-400 text-center w-12 leading-tight hidden sm:block">
                      {s}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: i < stepIdx ? 1 : 0 } : {}}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.4, ease: "easeInOut" }}
                      className="flex-1 h-0.5 rounded-full origin-left"
                      style={{ background: i < stepIdx ? "#0f0f0f" : "#e5e7eb" }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Expandable details + track button */}
      <div className="px-5 sm:px-6 pb-5 flex items-center justify-between gap-3 border-t border-gray-50 pt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(p => !p)}
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer flex items-center gap-1"
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="inline-block"
          >
            ↓
          </motion.span>
          {expanded ? "Hide details" : "View details"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400 }}
          onClick={onTrack}
          className="flex items-center gap-2 px-5 py-2 bg-[#0f0f0f] text-white text-xs tracking-[0.12em] uppercase rounded-xl cursor-pointer hover:bg-gray-700 transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          Track Order
        </motion.button>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-gray-50"
          >
            <div className="px-5 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Order Date", value: new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                { label: "Payment", value: item.paymentMethod },
                { label: "Payment Status", value: item.payment ? "Paid ✓" : "Pending" },
                { label: "Total", value: `${currency}${(item.price * item.quantity).toFixed(2)}` },
              ].map((d, i) => (
                <div key={i}>
                  <p className="text-[9px] tracking-[0.15em] text-gray-400 uppercase mb-0.5">{d.label}</p>
                  <p className="text-sm font-medium text-gray-800">{d.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Order = () => {
  const { BACKEND_URL, currency, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/orders/userorders`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const all = [];
        res.data.orders.forEach(order => {
          order.items.forEach(item => {
            all.push({ ...item, status: order.status, paymentMethod: order.paymentMethod, payment: order.payment, date: order.date });
          });
        });
        setOrderData(all.reverse());
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [token]);

  const filters = ["All", "Delivered", "Shipped", "Cancelled"];
  const filtered = filter === "All" ? orderData : orderData.filter(o => o.status === filter);

  return (
    <div className="border-t border-gray-100 pt-12 pb-20 min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8"
      >
        <div>
          <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase mb-1">History</p>
          <div className="text-2xl sm:text-3xl">
            <Title text1="YOUR" text2="ORDERS" />
          </div>
        </div>

        {/* Item count */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          className="bg-[#0f0f0f] text-white px-4 py-2 rounded-2xl text-xs tracking-wide self-start sm:self-auto"
        >
          {orderData.length} {orderData.length === 1 ? "Order" : "Orders"}
        </motion.div>
      </motion.div>

      {/* Filter pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {filters.map((f, i) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs tracking-widest uppercase border transition-all duration-200 cursor-pointer ${
              filter === f
                ? "bg-[#0f0f0f] text-white border-[#0f0f0f]"
                : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
            }`}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      {/* Loading skeleton */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
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
          transition={{ type: "spring", stiffness: 280 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="text-5xl">📭</div>
          <p className="text-gray-400 text-sm tracking-wide">No orders found</p>
        </motion.div>
      )}

      {/* Orders list */}
      {!loading && (
        <motion.div layout className="flex flex-col gap-4">
          <AnimatePresence>
            {filtered.map((item, index) => (
              <OrderCard
                key={`${item._id}-${item.size}-${index}`}
                item={item}
                index={index}
                currency={currency}
                onTrack={fetchOrders}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
};

export default Order;