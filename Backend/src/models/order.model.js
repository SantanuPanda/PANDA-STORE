const mongoose=require('mongoose');


const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items:{type:Array,required:true},
    totalAmount: { type: Number, required: true },
    address: { type:Object, required: true },
    status: { type: String, required:true, default: 'Order Placed' },
    paymentMethod: { type: String, enum: ['stripe', 'razorpay', 'cod'], required: true },
    payment: { type: Boolean, required: true , default: false},
    date: { type: Number,required: true},
  },
  { timestamps: true }
);

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = OrderModel;