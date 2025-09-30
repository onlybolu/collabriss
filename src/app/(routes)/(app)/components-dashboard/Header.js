'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { account } from '@/app/lib/appwrite';
import MenuIcon from '@/app/components/icons/MenuIcon';
import ChevronDownIcon from '@/app/components/icons/ChevronDownIcon';
import { useAppContext } from '@/app/context/AppContext';
import QuestionMarkCircleIcon from '@/app/components/icons/QuestionMarkCircleIcon';
import StoreIcon from '@/app/components/icons/StoreIcon';

export default function Header({ profile = {}, onMenuClick }) {
  const router = useRouter();
  const { setShowWalkthrough } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const storeUrl = profile?.subdomain ? `https://${profile.subdomain}.collabriss.site` : '#';

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 md:px-8 bg-white border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button id="mobile-menu-button" onClick={onMenuClick} className="md:hidden text-slate-600" aria-label="Open sidebar">
          <MenuIcon className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
          
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="hidden sm:block text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
          Point of Sale
        </button>
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="view-store-button"
          className="flex items-center gap-2 text-sm font-semibold text-white bg-[#2EBF83] px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          <StoreIcon className="w-4 h-4" />
          <span>View Store</span>
        </a>

        <div className="relative" ref={dropdownRef}>
          <button
            id="user-profile-dropdown"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-green-200 text-green-700 flex items-center justify-center font-bold text-sm">
              {getInitials(profile.firstName, profile.lastName)}
            </div>
            <span className="hidden lg:inline font-semibold text-slate-800 text-sm">
              {profile.firstName} {profile.lastName}
            </span>
            <ChevronDownIcon className="hidden lg:inline w-4 h-4 text-slate-500" />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-100 z-50 overflow-hidden"
              >
                <div className="py-1">
                  <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile</Link>
                  <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <span>Maintenance Mode</span>
                    {/* Basic toggle switch UI */}
                    <div className="w-10 h-5 bg-slate-200 rounded-full flex items-center p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setShowWalkthrough(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <QuestionMarkCircleIcon className="w-5 h-5 text-slate-400" />
                    <span>Dashboard Walkthrough</span>
                  </div>
                  <button className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">KYC Tiers</button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
)  };
