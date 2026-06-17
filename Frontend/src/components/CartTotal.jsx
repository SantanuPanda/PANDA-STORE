import React from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const {GetcartAmount,delivery_charge,currency}=useContext(ShopContext);
  
  return (
    <div className='w-full'>
      <Title text1="CART" text2="TOTAL" />
      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency} {GetcartAmount()}</p>
        </div>
        <hr/>
        <div className='flex justify-between'>
          <p>Delivery Fee</p>
          <p>{currency} {delivery_charge}</p>
        </div>
        <hr/>
        <div className='flex justify-between'>
          <p>Total</p>
          <p>{currency} {GetcartAmount() + delivery_charge}</p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
