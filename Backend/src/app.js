const express=require('express');
const userRoute=require('./routes/user.route');
const productRoute=require('./routes/product.route');
const cartRoute=require('./routes/cart.route');
const orderRoute=require('./routes/order.route');
const cors=require('cors');
const cookieParser = require("cookie-parser");


const app=express();

//middlewares

app.use(cookieParser());
app.use(cors({
  origin: ['https://panda-store-1.onrender.com', 'https://panda-store-admin.onrender.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//endpoints
app.get('/',(req,res)=>{
    res.send('Welcome to the E-commerce API');
});

//user routes
app.use('/api/users',userRoute);

//product routes
app.use('/api/products',productRoute);

//cart routes
app.use('/api/cart',cartRoute);

//order routes
app.use('/api/orders',orderRoute);

module.exports=app;