const productModel=require('../models/product.model');
const cloudinary = require('cloudinary').v2;
const { uploadToCloudinary } = require('../config/uploadCloudinary');

// Create a new product
const createProduct = async (req, res) => {
  const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

  try {

    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    const imageURL = await Promise.all(
      images.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);
        return result.secure_url;
      })
    );

    const ProductData = {
      name,
      description,
      price,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === 'true',
      image: imageURL   // store array of urls
    };

    const newProduct = new productModel(ProductData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};


//get list all products
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({
      message: 'Products retrieved successfully',
      products: products
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
};


//remove product by ID

const removeProductById = async (req, res) => {
  try {
    // Find and delete product in one step
    const product = await productModel.findByIdAndDelete(req.body.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    if (product.image?.length) {

      const deletePromises = product.image.map((imgUrl) => {
        const publicId =
          'products/' + imgUrl.split('/').pop().split('.')[0];

        return cloudinary.uploader.destroy(publicId);
      });

      await Promise.all(deletePromises);
    }

    res.status(200).json({
      status: 'success',
      message: 'Product and images deleted successfully'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Error deleting product',
      error: error.message
    });
  }
};

//get single product by ID
const GetsingleProductById = async (req, res) => {
  const {productId} = req.body;
  
  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product retrieved successfully',
      product: product
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
}

module.exports={
  createProduct,
  getAllProducts,
  removeProductById,
  GetsingleProductById
}