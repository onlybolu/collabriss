'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { databases, storage, ID } from '@/app/lib/appwrite';
import { useAppContext } from '@/app/context/AppContext';
import CloseIcon from '@/app/components/icons/CloseIcon';
import UploadCloudIcon from '@/app/components/icons/UploadCloudIcon';

const COLLECTIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_COLLECTION_ID;
const COLLECTION_IMAGES_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_IMAGES_BUCKET_ID;

export default function CreateCollectionModal({ isOpen, onClose, onCollectionCreated }) {
  const { user } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Collection name is required.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      let imageId = null;
      if (image) {
        const uploadedImage = await storage.createFile(COLLECTION_IMAGES_BUCKET_ID, ID.unique(), image);
        imageId = uploadedImage.$id;
      }

      const newCollection = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        COLLECTIONS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          name,
          description,
          imageId,
        }
      );

      onCollectionCreated(newCollection);
      onClose();
    } catch (err) {
      console.error('Failed to create collection:', err);
      setError('Failed to create collection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              <h2 className="text-xl font-bold text-slate-900">Create New Collection</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                <CloseIcon className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="collection-name" className="block text-sm font-medium text-slate-700">Collection Name <span className="text-red-500">*</span></label>
                <input type="text" id="collection-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer Collection" className="mt-1 block w-full form-input" required />
              </div>
              <div>
                <label htmlFor="collection-description" className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                <textarea id="collection-description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full form-textarea"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Collection Image (Optional)</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
                  <div className="text-center">
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-300" />
                    <div className="mt-4 flex text-sm leading-6 text-slate-600">
                      <label htmlFor="collection-image-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 hover:text-green-500">
                        <span>Upload an image</span>
                        <input id="collection-image-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                      </label>
                    </div>
                    {image && <p className="text-xs text-slate-500 mt-1">{image.name}</p>}
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={isLoading} className="bg-[#2EBF83] text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-green-600 disabled:bg-green-300">
                  {isLoading ? 'Creating...' : 'Create Collection'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

