import React from 'react';
import { motion } from 'framer-motion';
import './WencorpLogo.css';

export default function WencorpLogo() {
  return (
    <motion.div
      className="wencorp-logo"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
    >
      <motion.div
        className="logo-circle"
        animate={{
          boxShadow: [
            '0 0 20px rgba(212, 165, 116, 0.3)',
            '0 0 40px rgba(212, 165, 116, 0.6)',
            '0 0 20px rgba(212, 165, 116, 0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="logo-w">W</span>
      </motion.div>
      <div className="logo-text">WENCORP</div>
    </motion.div>
  );
}
