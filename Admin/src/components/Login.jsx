import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import { toast } from 'react-toastify';
import { Eye,EyeOff } from 'lucide-react';

const Login = ({setToken}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword,setshowPassword]=useState(false)

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
    const response=await axios.post(`${BACKEND_URL}/api/users/admin/login`, {email, password},{ withCredentials: true });

    
    if (response?.data?.token) {
      setToken(response.data.token);
      toast.success('Login successful');
    }
    else{
      toast.error(response.data?.message || 'Login failed');
    }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (  
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>

        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        <form onSubmit={handleSubmit}>

          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>

            <input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3 min-w-72 relative">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Password
            </p>

            <input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!showPassword ?
            <Eye className="absolute right-3 top-10 cursor-pointer text-gray-500" 
            size={20}
            onClick={() => setshowPassword(!showPassword)}
            />:<EyeOff className="absolute right-3 top-10 cursor-pointer text-gray-500" 
            size={20}
            onClick={() => setshowPassword(!showPassword)}
            />}
          </div>

          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer"
            type="submit"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;