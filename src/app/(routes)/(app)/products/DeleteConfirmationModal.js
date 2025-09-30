'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from '@/app/components/icons';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message, isLoading }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                <CloseIcon className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600">{message}</p>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="button" onClick={onConfirm} disabled={isLoading} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-red-700 disabled:bg-red-300">
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}