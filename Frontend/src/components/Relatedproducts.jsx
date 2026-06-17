import React from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useState } from 'react';
import { useEffect } from 'react';
import ProductItem from './ProductItem';
import Title from './Title';

const Relatedproducts = ({category,subCategory}) => {
  const {products}=useContext(ShopContext);
  const [relatedProducts,setRelatedProducts]=useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productcopy = products.slice();
      productcopy = productcopy.filter(item => category === item.category);
      productcopy = productcopy.filter(item => subCategory === item.subCategory);
      setRelatedProducts(productcopy.slice(0, 5));
    }
  }, [products]);

  return (
    <div className='py-12'>
        <div className=' text-center text-3xl py-2'>
        <Title text1="RELATED" text2="PRODUCTS" />
        </div>
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {relatedProducts.map((item, index) => (
         <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
      ))}
      </div>
    </div>
  )
}

export default Relatedproducts
