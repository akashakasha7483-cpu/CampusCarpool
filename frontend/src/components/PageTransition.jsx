import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
    filter: 'blur(3px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.24,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: 'blur(2px)',
    transition: {
      duration: 0.16,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

export const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

