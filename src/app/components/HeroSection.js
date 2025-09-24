'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section id="hero" className="text-center py-20 px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Business Toolkit, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-[#2EBF83]">All in One Place</span>
      </motion.h1>
      <motion.p
        className="mt-6 max-w-2xl mx-auto text-lg text-slate-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        The all-in-one commerce and business management tool for entrepreneurs. Sell online, manage inventory, and grow your customer base with ease.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <button className="mt-8 bg-[#2EBF83] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Get Started for Free</button>
      </motion.div>
    </section>
  );
}