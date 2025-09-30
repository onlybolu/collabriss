'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ChevronDownIcon from '@/app/components/icons/ChevronDownIcon';
import CheckCircleIcon from '@/app/components/icons/CheckCircleIcon';
import ChevronRightIcon from '@/app/components/icons/ChevronRightIcon';

const OnboardingTask = ({ title, isCompleted, href }) => (
  <Link href={href} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-3">
      <CheckCircleIcon className={`w-6 h-6 ${isCompleted ? 'text-green-500' : 'text-slate-300'}`} />
      <span className={`font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
        {title}
      </span>
    </div>
    {!isCompleted && <ChevronRightIcon className="w-5 h-5 text-slate-400" />}
  </Link>
);

export default function OnboardingNotice({ profile }) {
  const [isOpen, setIsOpen] = useState(true);

  const onboardingTasks = useMemo(() => [
    {
      id: 'profile',
      title: 'Complete your profile',
      isCompleted: !!profile.phone, // Example check: phone number exists
      href: '/settings',
    },
    {
      id: 'account-details',
      title: 'Add your bank account details',
      isCompleted: !!profile.bankAccount, // This field needs to be added to your profile schema
      href: '/settings',
    },
  ], [profile]);

  const completedTasks = useMemo(() => onboardingTasks.filter(task => task.isCompleted).length, [onboardingTasks]);
  const progress = (completedTasks / onboardingTasks.length) * 100;

  if (progress === 100) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mb-8 border border-slate-200">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="font-bold text-green-700 text-sm">{completedTasks}/{onboardingTasks.length}</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Complete your store setup</h3>
            <p className="text-sm text-slate-500">Follow these steps to get your store ready for customers.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-40 bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-[#2EBF83] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 p-2 sm:p-4">
              {onboardingTasks.map(task => <OnboardingTask key={task.id} {...task} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}