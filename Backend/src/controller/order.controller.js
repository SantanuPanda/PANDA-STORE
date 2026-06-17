const OrderModel=require("../models/order.model");
const UserModel=require("../models/user.model");
const Stripe = require('stripe');
const razorpay = require('razorpay');
const crypto = require('crypto');

//global variable

//gateway initialize
const stripe = new Stripe(process.env.Stripe_Secret_key);

const razorpayInstance = new razorpay({
  key_id: process.env.Razorpay_Key_ID,
  key_secret: process.env.Razorpay_Key_Secret
});

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { items, totalAmount, address, paymentMethod } = req.body;

    const newOrder = new OrderModel({
      userId,
      items,
      totalAmount,
      address,
      paymentMethod, // coming from frontend
      payment: paymentMethod === "cod" ? false : true,
      date: Date.now()
    });

    await newOrder.save();

    // reset cart
    await UserModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id
    });

  } catch (error) {
    console.log("Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message
    });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount, address } = req.body;
    const paymentMethod = "stripe";
    const { origin } = req.headers;

    const OrderData = {
      userId,
      items,
      totalAmount,
      address,
      paymentMethod,
      payment: false,
      date: Date.now()
    };

    const newOrder = new OrderModel(OrderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charge" },
        unit_amount: 49 * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      mode: "payment",
      line_items
    });

    return res.status(200).json({
      success: true,
      session_url: session.url
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message
    });
  }
};

const verifyStripe = async (req, res) => {
  try {

    const userId = req.user.id;
    const { success, orderId } = req.query;

    if (success === "true") {

      await OrderModel.findByIdAndUpdate(orderId,{
        payment:true,
        status:"Order Placed"
      });

      await UserModel.findByIdAndUpdate(userId,{ cartData:{} });

      return res.json({
        success:true,
        message:"Payment Verified"
      });

    } else {

      await OrderModel.findByIdAndDelete(orderId);

      return res.json({
        success:false,
        message:"Payment Cancelled"
      });

    }

  } catch (error) {

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }
};

const placeOrderRazorpay=async(req,res)=>{
  try {
    const userId = req.user.id;
    const { items, totalAmount, address } = req.body;

    const OrderData = {
      userId,
      items,
      totalAmount,
      address,
      paymentMethod: "razorpay",
      payment: false,
      date: Date.now()
    };

    const newOrder = new OrderModel(OrderData);
    await newOrder.save();

    const options = {
      amount: totalAmount*100, // amount in paise
      currency: "INR",
      receipt: newOrder._id.toString()
    };

    await razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay Order Creation Error:", err);

        return res.status(500).json({
          success: false,
          message: "Error placing order",
          error: err.message
        });
      }

      return res.status(200).json({
        success: true,
        order
      });
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message
    });
  }
}


const verifyRazorpay = async (req, res) => {

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto.createHmac("sha256", process.env.Razorpay_Key_Secret).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");

  if (generatedSignature === razorpay_signature) {
    return res.json({ success: true });
  }

  return res.json({ success: false });

};

// all order for Admin

const allOrders=async(req,res)=>{
  try {
    const orders=await OrderModel.find({});
    return res.status(200).json({ success: true, message: 'Orders retrieved successfully', orders });
  }
  catch(error){
    return res.status(500).json({ success: false, message: 'Error retrieving orders', error: error.message });
  }
}


//all order for Frontend

const userOrder=async(req,res)=>{
  try {
    const userId=req.user.id;
    const orders=await OrderModel.find({userId}).sort({createdAt:-1});
    return res.status(200).json({ success: true, message: 'Orders retrieved successfully', orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving orders', error: error.message });
  }
}

//Update order status for Admin

const updateOrderStatus=async(req,res)=>{
  try {
    const { orderId, status } = req.body;
    const order = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    return res.status(200).json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating order status', error: error.message });
  }
}



module.exports={placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrder,updateOrderStatus,verifyStripe,verifyRazorpay};