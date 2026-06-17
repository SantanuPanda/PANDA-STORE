import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Verify = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { token, setCartItems, BACKEND_URL } = useContext(ShopContext);

  console.log(token);
  

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const [message, setMessage] = useState("Verifying payment...");

  const verifyPayment = async () => {

    try {

      const response = await axios.get(
        `${BACKEND_URL}/api/orders/verifyStripe?success=${success}&orderId=${orderId}`,
        {
          headers:{ Authorization: token },
          withCredentials:true
        }
      );

      setMessage(response.data.message);

      if (response.data.success) {
        setCartItems({});
        setTimeout(() => navigate("/orders"), 2000);
      } else {
         setTimeout(() => navigate("/cart"), 2000);
      }

    } catch (error) {

      console.error("Error verifying payment:", error);
      setMessage("Payment verification failed.");

    }

  };

  useEffect(() => {

    if (success === "true") {
      verifyPayment();
    } else {
      setMessage("Payment cancelled");
      setTimeout(() => navigate("/cart"), 2000);
    }

  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h1 className="text-2xl font-semibold mb-4">Payment Verification</h1>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default Verify;