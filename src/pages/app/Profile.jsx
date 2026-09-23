import React from 'react';
import { motion } from 'motion/react';
import ProfileMain from '@features/Profile/ProfileMain';

function Profile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full"
    >
      <ProfileMain />
    </motion.div>
  );
}

export default Profile;