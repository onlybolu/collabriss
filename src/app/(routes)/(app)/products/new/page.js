'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { databases, ID, Query, PRODUCTS_COLLECTION_ID, COLLECTIONS_COLLECTION_ID } from '@/app/lib/appwrite';
import { useAppContext } from '@/app/context/AppContext';
import { ArrowLeftIcon, XCircleIcon, UploadCloudIcon } from '@/app/components/icons';
import CreateCollectionModal from '../CreateCollectionModal';

const FormCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">{title}</h2>
    <div className="space-y-6">{children}</div>
  </div>
);

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAppContext();
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasVariations, setHasVariations] = useState(false);
  const [collections, setCollections] = useState([]);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

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

    fetchCollections();
  }, [user]);

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, index) => index !== indexToRemove);
      return newPreviews;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !quantity || images.length === 0) {
      setError('Please fill in all required fields and upload at least one image.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Upload images to Cloudinary
      const uploadPromises = images.map(async (imageFile) => {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        return data.secure_url;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // 2. Create product document in the database
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          name,
          shortDescription,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
          imageUrls,
          collectionId: selectedCollection || null,
          status: 'published', // Explicitly set status on creation
        }
      );

      // 3. Redirect to products page
      router.push('/products');
    } catch (err) {
      console.error('Failed to create product:', err);
      setError('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectionCreated = (newCollection) => {
    setCollections(prev => [...prev, newCollection]);
    setSelectedCollection(newCollection.$id);
  };

  return (
    <div>
      <CreateCollectionModal isOpen={isCollectionModalOpen} onClose={() => setIsCollectionModalOpen(false)} onCollectionCreated={handleCollectionCreated} />
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Create Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <FormCard title="Product Images">
            <p className="text-sm text-slate-500 -mt-4">Add up to 5 images. The first image will be the main one.</p>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
              <div className="text-center">
                <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-slate-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500"
                  >
                    <span>Drag or drop images</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} disabled={images.length >= 5} />
                  </label>
                </div>
                <p className="text-xs leading-5 text-slate-500">Recommended: 930x1163px, Max 5mb</p>
              </div>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img src={src} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100">
                      <XCircleIcon className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormCard>

          <FormCard title="Product Details">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Product Name <span className="text-red-500">*</span></label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Classic T-Shirt" className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm py-3 px-4" required />
            </div>
            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-slate-700">Short Description (Optional)</label>
              <input type="text" id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="A brief, catchy description" className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm py-3 px-4" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">Full Description (Optional)</label>
              <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell your customers more about this product" className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm py-4 px-4"></textarea>
            </div>
          </FormCard>

          <FormCard title="Variations">
            <fieldset>
              <legend className="text-sm font-medium text-slate-900">Does this product have variations like Colours, Sizes, etc?</legend>
              <div className="mt-4 flex gap-8">
                <div className="flex items-center">
                  <input id="no-variations" name="variations" type="radio" checked={!hasVariations} onChange={() => setHasVariations(false)} className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-600" />
                  <label htmlFor="no-variations" className="ml-3 block text-sm font-medium text-gray-700">No, it doesn’t</label>
                </div>
                <div className="flex items-center">
                  <input id="yes-variations" name="variations" type="radio" checked={hasVariations} onChange={() => setHasVariations(true)} className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-600" />
                  <label htmlFor="yes-variations" className="ml-3 block text-sm font-medium text-gray-700">Yes, it has</label>
                </div>
              </div>
            </fieldset>
          </FormCard>

          <FormCard title="Pricing">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price <span className="text-red-500">*</span></label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="text-gray-500 sm:text-sm">₦</span></div>
                  <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="block w-full rounded-lg border-gray-200 pl-8 pr-4 py-3 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm" placeholder="0.00" required />
                </div>
              </div>
              <div>
                <label htmlFor="discountedPrice" className="block text-sm font-medium text-slate-700">Discounted Price (Optional)</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="text-gray-500 sm:text-sm">₦</span></div>
                  <input type="number" id="discountedPrice" className="block w-full rounded-lg border-gray-200 pl-8 pr-4 py-3 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm" placeholder="0.00" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="costPrice" className="block text-sm font-medium text-slate-700">Cost Price (Optional)</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="text-gray-500 sm:text-sm">₦</span></div>
                <input type="number" id="costPrice" className="block w-full rounded-lg border-gray-200 pl-8 pr-4 py-3 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm" placeholder="0.00" />
              </div>
              <p className="mt-1 text-xs text-slate-500">Without cost price, your profit won’t be calculated in Analytics.</p>
            </div>
          </FormCard>

          <FormCard title="Inventory">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Stock Quantity <span className="text-red-500">*</span></label>
              <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm py-3 px-4" required min="0" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-slate-700">Unit (Optional)</label>
                <input type="text" id="unit" placeholder="e.g., pc, kg, pack" className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm py-3 px-4" />
              </div>
              <div>
                <label htmlFor="barcode" className="block text-sm font-medium text-slate-700">Barcode (Optional)</label>
                <input type="text" id="barcode" placeholder="Scan or enter barcode" className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm py-3 px-4" />
              </div>
            </div>
          </FormCard>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-8">
          <FormCard title="Organization">
            <div>
              <label htmlFor="collection" className="block text-sm font-medium text-slate-700">Collection</label>
              <select id="collection" value={selectedCollection} onChange={(e) => setSelectedCollection(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm py-3 px-4">
                <option value="">Select a collection</option>
                {collections.map(col => (
                  <option key={col.$id} value={col.$id}>{col.name}</option>
                ))}
              </select>
              <button type="button" onClick={() => setIsCollectionModalOpen(true)} className="mt-2 text-sm font-semibold text-green-600 hover:text-green-700">
                + Create new collection
              </button>
            </div>
          </FormCard>

          <div className="sticky top-24">
            <div className="flex justify-end gap-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#2EBF83] text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}