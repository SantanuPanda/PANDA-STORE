import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence, useInView } from "framer-motion";

const STATUS_CONFIG = {
  "Order Placed":     { color: "#3b82f6", bg: "#eff6ff", icon: "📦" },
  "Packing":          { color: "#f59e0b", bg: "#fffbeb", icon: "📫" },
  "Shipped":          { color: "#8b5cf6", bg: "#f5f3ff", icon: "🚚" },
  "Out for Delivery": { color: "#06b6d4", bg: "#ecfeff", icon: "🛵" },
  "Delivered":        { color: "#10b981", bg: "#ecfdf5", icon: "✅" },
  "Cancelled":        { color: "#ef4444", bg: "#fef2f2", icon: "❌" },
  "Out Of Stock":     { color: "#f97316", bg: "#fff7ed", icon: "⚠️" },
  "Refund initiating":{ color: "#f59e0b", bg: "#fffbeb", icon: "↩" },
  "Refund Sucessfull":{ color: "#10b981", bg: "#ecfdf5", icon: "💚" },
};

const getStatus = (s) => STATUS_CONFIG[s] || { color: "#10b981", bg: "#ecfdf5", icon: "📦" };

const STATUS_OPTIONS = [
  "Order Placed", "Packing", "Shipped", "Out for Delivery",
  "Delivered", "Cancelled", "Out Of Stock", "Refund initiating", "Refund Sucessfull"
];

const OrderCard = ({ order, item, index, updateOrderStatus }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const status = getStatus(order.status);

  const handleStatusChange = async (val) => {
    setUpdating(true);
    await updateOrderStatus(order._id, val);
    setUpdating(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >

      {/* Status bar accent */}
      <div className="h-1 w-full" style={{ background: status.color, opacity: 0.4 }} />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* Product image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0"
          >
            <img src={item.image[0]} alt={item.name} className="w-full h-full object-cover" />
          </motion.div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

              {/* Product name + size */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 truncate max-w-xs">
                    {item.name}
                  </p>
                  <span className="text-[10px] tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                    {item.size}
                  </span>
                  <span className="text-[10px] tracking-wide text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Qty: {item.quantity}
                  </span>
                </div>

                {/* Customer name */}
                <p className="text-sm font-medium text-gray-700 mt-1.5">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}
                </p>
              </div>

              {/* Status badge */}
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
                style={{ background: status.bg, color: status.color }}
              >
                <span>{status.icon}</span>
                {order.status}
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-1.5 h-1.5 rounded-full ml-0.5"
                  style={{ background: status.color }}
                />
              </motion.div>
            </div>

            {/* Meta pills row */}
            <div className="flex flex-wrap gap-2.5 mt-3">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                {order.paymentMethod}
              </div>
              <div className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border ${
                order.payment ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
              }`}>
                {order.payment ? "✓ Paid" : "⏳ Pending"}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <div className="text-[10px] font-bold text-gray-800 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                ₹{item.price}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row — expand + status update */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-50">

          {/* Expand address */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(p => !p)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>↓</motion.span>
            {expanded ? "Hide details" : "View full address & phone"}
          </motion.button>

          {/* Status selector */}
          <div className="relative flex items-center gap-2">
            {updating && (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="block w-3.5 h-3.5 border-2 border-gray-200 border-t-gray-600 rounded-full shrink-0"
              />
            )}
            <div className="relative">
              <select
                defaultValue={order.status}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={updating}
                className="appearance-none bg-[#0f0f0f] text-white text-xs tracking-wide pl-4 pr-8 py-2.5 rounded-xl outline-none cursor-pointer disabled:opacity-50 border-0"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-2 border-t border-gray-50">
                {[
                  { label: "Full Address", value: `${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zipcode}, ${order.address.country}` },
                  { label: "Phone", value: order.address.phone },
                  { label: "Email", value: order.address.email || "—" },
                  { label: "Order Total", value: `₹${order.totalAmount || item.price}` },
                ].map((d, i) => (
                  <div key={i}>
                    <p className="text-[9px] tracking-[0.15em] text-gray-400 uppercase mb-0.5">{d.label}</p>
                    <p className="text-xs font-medium text-gray-800 leading-snug wrap-break-word">{d.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/orders/allorders`, { withCredentials: true });
      if (response.data.success) setOrders(response.data.orders);
    } catch {
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/orders/updateorderstatus`,
        { orderId, status },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) { toast.success(response.data.message); fetchOrders(); }
      else toast.error(response.data.message);
    } catch { toast.error("Error updating order status"); }
  };

  useEffect(() => { fetchOrders(); }, [token]);

  // Flatten items
  const flatOrders = orders.flatMap(order =>
    order.items.map(item => ({ order, item }))
  );

  const filtered = flatOrders.filter(({ order, item }) => {
    const q = search.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(q) ||
      order.address.firstName.toLowerCase().includes(q) ||
      order.address.lastName.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || order.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const quickFilters = ["All", "Order Placed", "Shipped", "Delivered", "Cancelled"];

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
          <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase mb-1">Management</p>
          <h1 className="text-2xl font-semibold text-gray-900">All Orders</h1>
        </div>

        <div className="flex items-center gap-3">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="text-xs bg-[#0f0f0f] text-white px-3 py-1.5 rounded-full"
          >
            {flatOrders.length} orders
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={fetchOrders}
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

      {/* Search + filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="flex items-center gap-2.5 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-gray-800 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by product or customer..."
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
                className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
              >
                <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="1" x2="9" y2="9" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="9" y1="1" x2="1" y2="9" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 flex-wrap">
          {quickFilters.map(f => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(f)}
              className={`px-3.5 py-2 rounded-xl text-xs tracking-wide border transition-all duration-200 cursor-pointer ${
                filterStatus === f
                  ? "bg-[#0f0f0f] text-white border-[#0f0f0f]"
                  : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Loading skeleton */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 animate-pulse border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="flex gap-2 mt-2">
                      {[...Array(3)].map((_, j) => <div key={j} className="h-6 w-16 bg-gray-100 rounded-full" />)}
                    </div>
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
          className="flex flex-col items-center justify-center py-24 gap-3"
        >
          <span className="text-5xl">📭</span>
          <p className="text-sm text-gray-400 tracking-wide">No orders found</p>
        </motion.div>
      )}

      {/* Order cards */}
      {!loading && (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {filtered.map(({ order, item }, index) => (
              <OrderCard
                key={`${order._id}-${item._id}-${index}`}
                order={order}
                item={item}
                index={index}
                updateOrderStatus={updateOrderStatus}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
};

export default Order;