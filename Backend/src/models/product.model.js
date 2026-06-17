const mongoose=require('mongoose');


const productSchema = new mongoose.Schema(
  {
    name: {type: String,required: true,trim: true,},
    description: {type: String,required: true,},
    price: {type: Number,required: true,min: 0,},
    image: [{type: String,required: true,},],
    category: {type: String,required: true,},
    subCategory: {type: String,required: true,},
    sizes: [{type: String,enum: ["S", "M", "L", "XL", "XXL"],},],
    bestseller: {type: Boolean,default: false,},
    date: {type: Number,default: Date.now,},
  },
  { timestamps: true }
);

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = ProductModel;