import React from 'react';
import { motion } from 'motion/react';
import BusinessApp from '@features/business/BusinessApp';

function Business() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full"
    >
      <BusinessApp />
    </motion.div>
  );
}

export default Business;
