const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();
const app=require('./src/app');
const ConnectCloudinary=require('./src/config/cloudinary');
const connectDB=require('./src/DB/db');


// Connect to MongoDB
connectDB();
//connect to cloudinary
ConnectCloudinary();

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});