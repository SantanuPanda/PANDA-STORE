import { createContext, useEffect } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";

// Create Context
export const ShopContext = createContext();

// Provider Component
const ShopContextProvider = ({ children }) => {

  const currency = "₹";
  const delivery_charge = 49;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const[search,setsearch]=useState("");
  const [products, setProducts] = useState([]);
  const[showsearch,setshowsearch]=useState(false);
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [token,setToken]=useState('');

  const addToCart = async(ItemId,Size) => {
    if(!Size){
      toast.warn("Please select a size");
      return;
    }
    let cartData=structuredClone(cartItems);
    if(cartData[ItemId]){
      if(cartData[ItemId][Size]){
        cartData[ItemId][Size]+=1;
      } else {
        cartData[ItemId][Size]=1;
      }
  } else {
    cartData[ItemId]={};
    cartData[ItemId][Size]=1;
  }
  setCartItems(cartData);
  const Token=localStorage.getItem("token");
  if(Token){
    try {
      const response = await axios.post(`${BACKEND_URL}/api/cart/addtocart`,{productId: ItemId, size: Size},{withCredentials: true});
      console.log(response);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart",error.message);
    }
  }
  };

const getcartcount = () => {
  let count = 0;

  for (let key in cartItems) {
    for (let size in cartItems[key]) {
      try {
        if (cartItems[key][size] > 0) {
          count += cartItems[key][size];
        }
      } catch (error) {
        console.error("Error counting cart items:", error);
      }
    }
  }
  return count;
};

const Updatequantity=async(itemId,size,quantity)=>{
    let cartData=structuredClone(cartItems);
    cartData[itemId][size]=quantity;
    setCartItems(cartData);

    const Token=localStorage.getItem("token");

    if (Token) {
      try {
        const response = await axios.post(`${BACKEND_URL}/api/cart/updatecart`, { productId: itemId, size, quantity }, { withCredentials: true });
        console.log(response.data);
      } catch (error) {
        console.error("Error updating cart quantity:", error);
        toast.error("Failed to update cart quantity", error.message);
      }
    }
}

const GetcartAmount=()=>{
    let TotalAmount=0;
    for(let key in cartItems){
      let Iteminfo=products.find(item => item._id === key);

      for(let size in cartItems[key]){
        try {
          if(cartItems[key][size]>0){
            TotalAmount+=cartItems[key][size]*Iteminfo.price;
          }
        } catch (error) {
          console.error("Error calculating cart amount:", error);
        }
    }
  }
    return TotalAmount;
}


const GetUserCart=async()=>{
  const Token=localStorage.getItem("token");
  
  if(Token){
    const response=await axios.get(`${BACKEND_URL}/api/cart/getcart`,{withCredentials:true});
    console.log(response.data);
    setCartItems(response.data.cartData);
  }

}

const fetchProductsData = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/products/getallproducts`);
    console.log(response.data);
    setProducts(response.data.products);
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
}



useEffect(() => {
  fetchProductsData();
}, []);

useEffect(()=>{
  if (!token && localStorage.getItem('token')) {
    setToken(localStorage.getItem('token'));
    GetUserCart();
  }
}, []);

// Add these two functions
const getUserProfile = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/profile`, { withCredentials: true });
    console.log(response.data.user);
    setUser(response.data.user);
  } catch (error) {
    toast.error("Failed to fetch profile");
  }
};

const updateUserProfile = async (formData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/users/update-profile`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setUser(response.data.user);
    toast.success("Profile updated successfully!");
  } catch (error) {
    toast.error("Failed to update profile");
  }
};


  const value = {
    products,
    currency,
    delivery_charge,
    search,
    setsearch,
    showsearch,
    setshowsearch,
    cartItems,
    addToCart,
    setCartItems,
    getcartcount,
    Updatequantity,
    GetcartAmount,
    BACKEND_URL,
    token,
    setToken,
    user,
    setUser,
    getUserProfile,
    updateUserProfile
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
