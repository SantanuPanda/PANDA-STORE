import React, { useState, useContext } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const inputBase =
  "w-full bg-transparent text-sm text-gray-800 outline-none placeholder-gray-300 border-b border-gray-200 py-3 focus:border-gray-800 transition-colors duration-200";

const fields = [
  [
    { name: "firstName", placeholder: "First name", type: "text" },
    { name: "lastName", placeholder: "Last name", type: "text" },
  ],
  [{ name: "email", placeholder: "Email address", type: "email" }],
  [{ name: "street", placeholder: "Street address", type: "text" }],
  [
    { name: "city", placeholder: "City", type: "text" },
    { name: "state", placeholder: "State / Province", type: "text" },
  ],
  [
    { name: "zipcode", placeholder: "ZIP / Postal code", type: "text" },
    { name: "country", placeholder: "Country", type: "text" },
  ],
  [{ name: "phone", placeholder: "Phone number", type: "tel" }],
];

const paymentMethods = [
  { id: "stripe", label: "Stripe", logo: true, logoKey: "stripe_logo", desc: "Pay with card" },
  { id: "razorpay", label: "Razorpay", logo: true, logoKey: "razorpay_logo", desc: "UPI / Net Banking" },
  { id: "cod", label: "Cash on Delivery", logo: false, icon: "💵", desc: "Pay when delivered" },
];

const Step = ({ number, label, active }) => (
  <div className="flex items-center gap-2">
    <motion.div
      animate={{
        background: active ? "#0f0f0f" : "#f3f4f6",
        color: active ? "#fff" : "#9ca3af",
      }}
      transition={{ duration: 0.3 }}
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
    >
      {number}
    </motion.div>
    <span className={`text-xs font-medium tracking-wide transition-colors ${active ? "text-gray-900" : "text-gray-300"}`}>
      {label}
    </span>
  </div>
);

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, products, BACKEND_URL, GetcartAmount, delivery_charge, setCartItems } = useContext(ShopContext);

  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = address, 2 = payment
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "", phone: "",
  });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const initRazorpay = async (orderdata) => {
    const option = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderdata.totalAmount * 100,
      currency: "INR",
      name: "Forever",
      description: "Order Payment",
      order_id: orderdata.id,
      receipt: orderdata.receipt,
      handler: async (response) => {
        try {
          const verify = await axios.post(`${BACKEND_URL}/api/orders/verifyRazorpay`, response, { withCredentials: true });
          if (verify.data.success) { toast.success("Payment Successful"); setCartItems({}); navigate("/orders"); }
          else toast.error("Payment verification failed");
        } catch (e) { console.log(e); }
      },
    };
    new window.Razorpay(option).open();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!method) return toast.error("Please select a payment method");
    setLoading(true);
    try {
      const orderItems = [];
      for (let key in cartItems)
        for (let size in cartItems[key])
          if (cartItems[key][size] > 0) {
            let item = structuredClone(products.find(p => p._id === key));
            item.size = size; item.quantity = cartItems[key][size];
            orderItems.push(item);
          }
      const orderData = { address: formData, items: orderItems, totalAmount: GetcartAmount() + delivery_charge, paymentMethod: method };

      if (method === "stripe") {
        const res = await axios.post(`${BACKEND_URL}/api/orders/placestripeorder`, orderData, { withCredentials: true });
        if (res.data.success) window.location.replace(res.data.session_url);
        else toast.error("Stripe error");
      } else if (method === "razorpay") {
        const res = await axios.post(`${BACKEND_URL}/api/orders/placerazorpayorder`, orderData, { withCredentials: true });
        if (res.data.success) initRazorpay(res.data.order);
      } else if (method === "cod") {
        const res = await axios.post(`${BACKEND_URL}/api/orders/placeorder`, orderData, { withCredentials: true });
        if (res.data.success) { setCartItems({}); toast.success(res.data.message); navigate("/orders"); }
        else toast.error(res.data.message);
      }
    } catch (err) { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  // Validate step 1 before proceeding
  const handleNext = () => {
    const required = ["firstName", "lastName", "email", "street", "city", "state", "zipcode", "country", "phone"];
    const empty = required.find(k => !formData[k]);
    if (empty) return toast.error("Please fill all address fields");
    setStep(2);
  };

  return (
    <div className="border-t border-gray-100 pt-10 pb-24 min-h-screen">

      {/* Top header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
      >
        <div>
          <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase mb-1">Secure Checkout</p>
          <div className="text-2xl sm:text-3xl">
            <Title text1="PLACE" text2="ORDER" />
          </div>
        </div>

        {/* Step breadcrumb */}
        <div className="flex items-center gap-3">
          <Step number={1} label="Delivery" active={step >= 1} />
          <motion.div
            animate={{ background: step >= 2 ? "#d1d5db" : "#f3f4f6" }}
            className="w-8 h-px"
          />
          <Step number={2} label="Payment" active={step >= 2} />
        </div>
      </motion.div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* ── LEFT PANEL ── */}
          <div className="w-full xl:flex-1">
            <AnimatePresence mode="wait">

              {/* STEP 1 — Address */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Card header */}
                  <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#0f0f0f] flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.18em] text-gray-400 uppercase">Step 1 of 2</p>
                      <p className="text-sm font-semibold text-gray-900">Delivery Address</p>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="px-8 py-6 flex flex-col gap-1">
                    {fields.map((row, ri) => (
                      <motion.div
                        key={ri}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: ri * 0.06, duration: 0.35 }}
                        className="flex gap-6"
                      >
                        {row.map((field) => (
                          <div key={field.name} className="flex-1 relative">
                            <input
                              name={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formData[field.name]}
                              onChange={onChange}
                              className={inputBase}
                            />
                          </div>
                        ))}
                      </motion.div>
                    ))}
                  </div>

                  {/* Next button */}
                  <div className="px-8 pb-8">
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="w-full py-4 bg-[#0f0f0f] text-white rounded-2xl text-xs tracking-[0.18em] uppercase font-medium cursor-pointer"
                    >
                      Continue to Payment →
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Payment */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Card header */}
                  <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#0f0f0f] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.18em] text-gray-400 uppercase">Step 2 of 2</p>
                        <p className="text-sm font-semibold text-gray-900">Payment Method</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      ← Edit address
                    </button>
                  </div>

                  {/* Address preview */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mx-8 mt-6 flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100"
                  >
                    <span className="text-base mt-0.5">📍</span>
                    <div>
                      <p className="text-xs font-medium text-gray-700">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                        {formData.street}, {formData.city}, {formData.state} {formData.zipcode}, {formData.country}
                      </p>
                    </div>
                  </motion.div>

                  {/* Payment cards */}
                  <div className="px-8 py-6 flex flex-col gap-3">
                    {paymentMethods.map((pm, i) => (
                      <motion.div
                        key={pm.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        onClick={() => setMethod(pm.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                          method === pm.id
                            ? "border-[#0f0f0f] bg-gray-50 shadow-sm"
                            : "border-gray-100 hover:border-gray-200 bg-white"
                        }`}
                      >
                        {/* Radio */}
                        <motion.div
                          animate={{
                            backgroundColor: method === pm.id ? "#0f0f0f" : "#fff",
                            borderColor: method === pm.id ? "#0f0f0f" : "#e5e7eb",
                          }}
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                        >
                          {method === pm.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}
                              className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </motion.div>

                        {/* Logo / label */}
                        <div className="flex-1 flex items-center gap-3">
                          {pm.logo ? (
                            <img src={assets[pm.logoKey]} alt={pm.label} className="h-5 object-contain" />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{pm.icon}</span>
                              <span className="text-sm font-medium text-gray-700">{pm.label}</span>
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] text-gray-400 tracking-wide hidden sm:block">{pm.desc}</span>

                        <AnimatePresence>
                          {method === pm.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              className="w-5 h-5 rounded-full bg-[#0f0f0f] flex items-center justify-center"
                            >
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>

                  {/* Submit */}
                  <div className="px-8 pb-8">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.97 }}
                      className="w-full py-4 bg-[#0f0f0f] text-white rounded-2xl text-xs tracking-[0.2em] uppercase font-medium cursor-pointer disabled:opacity-50"
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2">
                            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                              className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                            Processing...
                          </motion.span>
                        ) : (
                          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            Place Order →
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <p className="text-center text-[10px] text-gray-300 tracking-wide mt-3">
                      🔒 128-bit SSL encrypted & secure
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT — Order Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full xl:w-96 flex flex-col gap-4"
          >
            {/* Summary card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Order Summary</p>
              </div>
              <div className="px-6 py-5">
                <CartTotal />
              </div>
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { icon: "🔒", label: "Secure Pay" },
                { icon: "↩", label: "Easy Return" },
                { icon: "🚚", label: "Fast Ship" },
              ].map((badge, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl px-3 py-4 flex flex-col items-center gap-1 text-center">
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-[10px] text-gray-400 tracking-wide">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;