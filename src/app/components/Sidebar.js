'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardListIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  WalletIcon,
  TagIcon,
  MegaphoneIcon,
  PuzzlePieceIcon,
  CogIcon,
} from '@/app/components/icons';
import ChevronsLeftIcon from './icons/ChevronsLeftIcon';

const sidebarSections = [
  {
    title: 'Quick Access',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Products', href: '/products', icon: ShoppingBagIcon },
      { name: 'Orders', href: '/orders', icon: ClipboardListIcon },
      { name: 'Abandoned Carts', href: '/abandoned-carts', icon: ShoppingCartIcon },
      { name: 'Customers', href: '/customers', icon: UsersIcon },
    ],
  },
  {
    title: 'Growth',
    items: [
      { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
      { name: 'Discounts', href: '/discounts', icon: TagIcon },
      { name: 'Campaigns', href: '/campaigns', icon: MegaphoneIcon },
    ],
  },
  {
    title: 'Store Management',
    items: [
      { name: 'Collabriss Wallet', href: '/wallet', icon: WalletIcon, beta: true },
      { name: 'Extensions', href: '/extensions', icon: PuzzlePieceIcon },
      { name: 'Settings', href: '/settings', icon: CogIcon },
    ],
  },
];

const SidebarContent = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();
  return (
    <>
      <div style={{ height: '5rem' }} className="flex items-center justify-between px-4 border-b border-slate-200 flex-shrink-0">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard" className="flex-shrink-0">
                <NextImage src="/logo.png" alt="Collabriss Logo" width={1000} height={28} className="h-40 w-auto" priority />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-all"
        >
          <ChevronsLeftIcon className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </motion.h3>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href} className={`flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors ${isCollapsed ? 'justify-center px-2' : 'px-4'} ${pathname.startsWith(item.href) && item.href !== '/dashboard' || pathname === item.href ? 'bg-[#2EBF83] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="whitespace-nowrap overflow-hidden flex-1">{item.name}</motion.span>
                      )}
                    </AnimatePresence>
                    {item.beta && !isCollapsed && <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Beta</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
};

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, isCollapsed, setIsCollapsed }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed h-full z-20 flex-shrink-0 bg-white border-r border-slate-200 flex-col hidden md:flex transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-40 flex flex-col md:hidden"
            >
              <SidebarContent isCollapsed={false} setIsCollapsed={() => {}} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
