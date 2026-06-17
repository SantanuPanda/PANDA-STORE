import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-900 focus:bg-white transition-all placeholder-gray-300";

const Login = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, BACKEND_URL } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentState === "Sign Up") {
        const res = await axios.post(`${BACKEND_URL}/api/users/register`, { name, email, password }, { withCredentials: true });
        if (res.data.success) { toast.success(res.data.message); setCurrentState("Verify OTP"); }
        else toast.error(res.data.message);
      } else if (currentState === "Verify OTP") {
        const res = await axios.post(`${BACKEND_URL}/api/users/verify-otp`, { email, otp }, { withCredentials: true });
        if (res.data.success) {
          toast.success(res.data.message);
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
        } else toast.error(res.data.message || "Invalid OTP");
      } else {
        const res = await axios.post(`${BACKEND_URL}/api/users/login`, { email, password }, { withCredentials: true });
        if (res.data.success) {
          toast.success(res.data.message);
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, [token]);

  const switchState = () => {
    setCurrentState(currentState === "Login" ? "Sign Up" : "Login");
    setName(""); setEmail(""); setPassword(""); setOtp("");
  };

  const titles = {
    "Login": { heading: "Welcome back", sub: "Sign in to your Forever account" },
    "Sign Up": { heading: "Create account", sub: "Join Forever and start shopping" },
    "Verify OTP": { heading: "Check your email", sub: `We sent a 6-digit code to ${email}` },
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Dark header */}
          <div className="bg-[#0f0f0f] px-8 pt-8 pb-10 relative overflow-hidden">
            <div className="absolute top-[-40%] right-[-10%] w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none"
              style={{ background: "#c9a96e" }} />
            <div className="absolute bottom-[-40%] left-[-10%] w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none"
              style={{ background: "#a87ec9" }} />

            <div className="relative z-10">
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                className="inline-flex items-center gap-2 bg-white/10 text-white/50 text-[9px] tracking-[0.22em] uppercase px-3 py-1 rounded-full mb-4 border border-white/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-pulse" />
                Forever Store
              </motion.p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentState}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1 className="text-2xl font-semibold text-white mb-1">
                    {titles[currentState].heading}
                  </h1>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {titles[currentState].sub}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-7">
            <form onSubmit={onSubmit} className="flex flex-col gap-3.5">

              <AnimatePresence mode="wait">

                {/* OTP screen */}
                {currentState === "Verify OTP" && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col gap-3.5"
                  >
                    {/* OTP boxes */}
                    <div>
                      <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-2">
                        6-Digit Code
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="• • • • • •"
                        maxLength={6}
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-center text-xl tracking-[0.5em] font-bold text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all placeholder-gray-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentState("Sign Up")}
                      className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer text-left flex items-center gap-1"
                    >
                      ← Back to Sign Up
                    </button>
                  </motion.div>
                )}

                {/* Login / Sign Up fields */}
                {currentState !== "Verify OTP" && (
                  <motion.div
                    key={currentState + "-fields"}
                    initial={{ opacity: 0, x: currentState === "Sign Up" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: currentState === "Sign Up" ? -20 : 20 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col gap-3.5"
                  >
                    <AnimatePresence>
                      {currentState === "Sign Up" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-1.5">Full Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Alex Johnson"
                            required
                            className={inputClass}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-400 mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className={inputClass + " pr-10"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                          {showPass ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {currentState === "Login" && (
                      <div className="flex justify-between items-center -mt-1">
                        <span />
                        <button type="button" className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="w-full py-3.5 bg-[#0f0f0f] text-white rounded-2xl text-xs tracking-[0.2em] uppercase font-medium cursor-pointer disabled:opacity-50 mt-1 overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                      {currentState === "Verify OTP" ? "Verifying..." : currentState === "Sign Up" ? "Creating..." : "Signing in..."}
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {currentState === "Verify OTP" ? "Verify Code" : currentState === "Sign Up" ? "Create Account" : "Sign In"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

            </form>

            {/* Switch state */}
            {currentState !== "Verify OTP" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-xs text-gray-400 mt-5"
              >
                {currentState === "Login" ? "Don't have an account?" : "Already have an account?"}
                {" "}
                <button
                  type="button"
                  onClick={switchState}
                  className="text-gray-900 font-semibold hover:underline cursor-pointer"
                >
                  {currentState === "Login" ? "Sign Up" : "Sign In"}
                </button>
              </motion.p>
            )}
          </div>
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[10px] text-gray-300 tracking-wide mt-4"
        >
          🔒 Your data is safe & encrypted
        </motion.p>

      </motion.div>
    </div>
  );
};

export default Login;