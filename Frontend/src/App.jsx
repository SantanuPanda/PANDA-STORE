import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify';
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Login from './pages/Login'
import Order from './pages/Order'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { useContext } from 'react';
import { ShopContext } from './context/ShopContext';
import Verify from './pages/verify';
import MyProfile from './pages/MyProfile';
import Setting from './pages/Setting';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore } from './context/useThemeStore';

// Wraps every page with a fade+slide transition
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

const App = () => {
  const { theme } = useThemeStore();
  const location = useLocation()
  const { cartItems } = useContext(ShopContext);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[6vw] lg:px-[7vw]' data-theme={theme}>
      <ToastContainer />
      <Navbar/>
      <SearchBar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<PageWrapper><Home /></PageWrapper>} />
          <Route path='/collection' element={<PageWrapper><Collection /></PageWrapper>} />
          <Route path='/about' element={<PageWrapper><About /></PageWrapper>} />
          <Route path='/contact' element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path='/product/:id' element={<PageWrapper><Product /></PageWrapper>} />
          <Route path='/cart' element={<PageWrapper>{Object.keys(cartItems).length > 0 ? <Cart /> : <Home />}</PageWrapper>} />
          <Route path='/placeorder' element={<PageWrapper><PlaceOrder /></PageWrapper>} />
          <Route path='/login' element={<PageWrapper><Login /></PageWrapper>} />
          <Route path='/orders' element={<PageWrapper><Order /></PageWrapper>} />
          <Route path='/verify' element={<PageWrapper><Verify /></PageWrapper>} />
          <Route path='/my-profile' element={<PageWrapper><MyProfile /></PageWrapper>} />
          <Route path='/settings' element={<PageWrapper><Setting /></PageWrapper>} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default App