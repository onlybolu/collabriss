'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { databases, storage, ID, Query, PRODUCTS_COLLECTION_ID, PRODUCT_IMAGES_BUCKET_ID, COLLECTIONS_COLLECTION_ID } from '@/app/lib/appwrite';
import { useAppContext } from '@/app/context/AppContext';
import { CloseIcon, UploadCloudIcon, XCircleIcon } from '@/app/components/icons';

export default function EditProductModal({ isOpen, onClose, product, onProductUpdated }) {
  const { user } = useAppContext();
  const [formData, setFormData] = useState({});
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when a product is passed
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        collectionId: product.collectionId || '',
        // We'll handle images separately
      });
    }
  }, [product]);

  // Fetch collections for the dropdown
  useEffect(() => {
    const fetchCollections = async () => {
      if (!user) return;
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          COLLECTIONS_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );
        setCollections(response.documents);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };
    if (isOpen) {
      fetchCollections();
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const dataToUpdate = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };

      const updatedDocument = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        product.$id,
        dataToUpdate
      );

      onProductUpdated(updatedDocument);
      onClose();
    } catch (err) {
      console.error('Failed to update product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Edit Product</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                <CloseIcon className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* NOTE: Image editing is complex and will be added in a future step. */}
              {/* For now, we focus on text and number fields. */}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Product Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full form-input py-3" required />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full form-textarea"></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price <span className="text-red-500">*</span></label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-gray-500 sm:text-sm">₦</span></div>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="block w-full form-input pl-7 pr-12 py-3" placeholder="0.00" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Stock Quantity <span className="text-red-500">*</span></label>
                  <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full form-input py-3" required min="0" />
                </div>
              </div>

              <div>
                <label htmlFor="collectionId" className="block text-sm font-medium text-slate-700">Collection</label>
                <select id="collectionId" name="collectionId" value={formData.collectionId} onChange={handleChange} className="mt-1 block w-full form-select py-3">
                  <option value="">No collection</option>
                  {collections.map(col => (
                    <option key={col.$id} value={col.$id}>{col.name}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="bg-[#2EBF83] text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-green-600 disabled:bg-green-300">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
