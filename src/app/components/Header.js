'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@/app/components/icons/MenuIcon';
import CloseIcon from '@/app/components/icons/CloseIcon';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full px-4 transition-all duration-300 ${
          hasScrolled
            ? 'bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm'
            : 'bg-white/80 backdrop-blur-lg border-b border-transparent'
        }`}
      >
        <nav className="container mx-auto flex justify-between items-center h-16">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="collabriss" width={1000} height={40} className="h-46 w-auto" priority />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-slate-600 hover:text-[#2EBF83] transition-colors">{link.name}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center">
            <Link href="/login" className="py-2 px-4 bg-[#2EBF83] text-white rounded-lg hover:bg-green-600 transition-colors">Sign In</Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              <MenuIcon className="w-6 h-6 text-slate-800" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-white p-4 md:hidden"
          >
            <div className="flex justify-end mb-8">
              <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                <CloseIcon className="w-6 h-6 text-slate-800" />
              </button>
            </div>
            <nav className="flex flex-col items-center space-y-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-2xl font-semibold text-slate-700 hover:text-[#2EBF83]" onClick={() => setIsMenuOpen(false)}>{link.name}</a>
              ))}
              <Link href="/login" className="w-full text-center py-3 px-4 bg-[#2EBF83] text-white rounded-lg text-2xl font-semibold hover:bg-green-600" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
      