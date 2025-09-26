'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import CloseIcon from './icons/CloseIcon';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasBeenShown = localStorage.getItem('newsletterPopupShown');
    if (hasBeenShown) {
      return;
    }

    // Random delay between 5 and 15 seconds
    const randomDelay = Math.random() * 10000 + 5000;

    const timer = setTimeout(() => {
      setIsOpen(true);
      localStorage.setItem('newsletterPopupShown', 'true');
    }, randomDelay);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with email:', e.target.email.value);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Stay Updated!</h2>
                <p className="text-slate-600 mb-6">
                  Join our newsletter to get the latest updates and special offers from Collabriss.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#2EBF83] text-white font-bold py-3 rounded-lg text-lg hover:bg-green-600 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
              <div className="relative hidden md:block order-1 md:order-2">
                <Image src="/ads.jpg" alt="Collabriss promotion" width={600} height={800} className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}