import React from 'react';
import { motion } from 'motion/react';
import OrdersMain from '@features/orders/OrdersMain';

function Orders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full"
    >
      <OrdersMain />
    </motion.div>
  );
}

export default Orders;
