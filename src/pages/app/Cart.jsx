import React from 'react';
import { motion } from 'motion/react';
import CartMain from '@features/cart/CartMain';

function Cart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full"
    >
      <CartMain />
    </motion.div>
  );
}

export default Cart;
