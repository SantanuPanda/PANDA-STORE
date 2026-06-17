import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const { setshowsearch, getcartcount, user, getUserProfile } = useContext(ShopContext);
  const { token, setToken, BACKEND_URL, setCartItems } = useContext(ShopContext);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (token) getUserProfile();
  }, [token]);

  // Close dropdown on outside click/touch
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const logoutUser = async () => {
    const response = await axios.post(`${BACKEND_URL}/api/users/logout`, {}, { withCredentials: true });
    if (response.data.success) toast.success(response.data.message);
    else toast.error(response.data.message);
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
    setCartItems({});
    setDropdownOpen(false);
  };

  const navLinks = [
    { label: "HOME", to: "/" },
    { label: "COLLECTION", to: "/collection" },
    { label: "ABOUT", to: "/about" },
    { label: "CONTACT", to: "/contact" },
  ];

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 bg-transparent px-4 sm:px-8 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.06)]" : ""
      }`}
    >
      <div className="flex justify-between items-center py-4 font-medium max-w-7xl mx-auto">

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
          <Link to="/">
            <img src={assets.logo} alt="logo" className="w-32 sm:w-36" />
          </Link>
        </motion.div>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex items-center gap-8 text-[11px] tracking-[0.15em] text-gray-500">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: "easeOut" }}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `relative pb-1 transition-colors duration-200 hover:text-gray-900 ${
                    isActive ? "text-gray-900" : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <motion.span
                      className="absolute bottom-0 left-0 h-[1.5px] bg-gray-900 block"
                      initial={false}
                      animate={{ width: isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-5">

          {/* Search */}
          <motion.img
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 object-contain cursor-pointer"
            onClick={() => { setshowsearch(true); navigate("/collection"); }}
          />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={() => token ? setDropdownOpen((p) => !p) : navigate("/login")}
              className="cursor-pointer"
            >
              {token && user?.photo ? (
                <img
                  src={user.photo}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border-[1.5px] border-gray-300"
                />
              ) : (
                <img src={assets.profile_icon} alt="profile" className="w-5 h-5 object-contain" />
              )}
            </motion.div>

            {/* Dropdown */}
            <AnimatePresence>
              {token && dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 z-50 origin-top-right"
                >
                  <div className="bg-white border border-gray-100 shadow-xl rounded-2xl w-44 py-2 overflow-hidden">
                    {[
                      { label: "My Profile", icon: "👤", action: () => { navigate("/my-profile"); setDropdownOpen(false); } },
                      { label: "Orders", icon: "📦", action: () => { navigate("/orders"); setDropdownOpen(false); } },

                      { label: "Settings", icon: "⚙️", action: () => { navigate("/settings"); setDropdownOpen(false); } },
                    ].map((item, i) => (
                      <motion.p
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={item.action}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer transition-colors"
                      >
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                      </motion.p>
                    ))}
                    <div className="mx-4 my-1 border-t border-gray-100" />
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={logoutUser}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
                    >
                      <span className="text-base">🚪</span>
                      Logout
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link to="/cart" className="relative block">
              <img src={assets.cart_icon} alt="cart" className="w-5 h-5 object-contain" />
              <AnimatePresence>
                {getcartcount() > 0 && (
                  <motion.p
                    key={getcartcount()}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -right-1.5 -bottom-1.5 w-4 h-4 text-center leading-4 bg-black text-white rounded-full text-[8px]"
                  >
                    {getcartcount()}
                  </motion.p>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* Mobile Hamburger */}
          <motion.img
            whileTap={{ scale: 0.85 }}
            src={assets.menu_icon}
            alt="menu"
            className="w-5 h-5 object-contain cursor-pointer sm:hidden"
            onClick={() => setVisible(true)}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {visible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setVisible(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div
                className="flex items-center gap-3 p-5 border-b border-gray-100 cursor-pointer"
                onClick={() => setVisible(false)}
              >
                <motion.img
                  whileTap={{ x: -3 }}
                  src={assets.dropdown_icon}
                  alt="back"
                  className="h-4 rotate-180"
                />
                <span className="text-sm text-gray-500 tracking-widest">CLOSE</span>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.07, ease: "easeOut" }}
                  >
                    <NavLink
                      onClick={() => setVisible(false)}
                      className={({ isActive }) =>
                        `block py-3.5 px-6 text-sm tracking-[0.12em] border-b border-gray-50 transition-colors ${
                          isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-900"
                        }`
                      }
                      to={link.to}
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Profile Actions (if logged in) */}
              {token && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-auto border-t border-gray-100 py-4 px-6 flex flex-col gap-3"
                >
                  <p className="text-xs tracking-widest text-gray-400 mb-1">ACCOUNT</p>
                  <p className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" onClick={() => { navigate("/my-profile"); setVisible(false); }}>👤 My Profile</p>
                  
                  <p className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" onClick={() => { navigate("/orders"); setVisible(false); }}>📦 Orders</p>

                  <p className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" onClick={() => { navigate("/settings"); setVisible(false); }}>⚙️ Settings</p>

                  <p className="text-sm text-red-400 cursor-pointer hover:text-red-600" onClick={logoutUser}>🚪 Logout</p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;