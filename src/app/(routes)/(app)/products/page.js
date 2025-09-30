'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppContext } from '@/app/context/AppContext';
import { databases, Query, PRODUCTS_COLLECTION_ID } from '@/app/lib/appwrite';
import { PencilIcon, TrashIcon, SearchIcon, RefreshIcon, ChevronDownIcon, CloseIcon } from '@/app/components/icons';
import EditProductModal from './EditProductModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const ProductStatCard = ({ title, value, icon, iconBgColor, currency = false }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                    {currency && '₦'}{value.toLocaleString()}
                </p>
            </div>
            <div className={`text-white p-3 rounded-full ${iconBgColor}`}>
                {icon}
            </div>
        </div>
    </div>
);

export default function ProductsPage() {
  const { user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0, totalRetailValue: 0, productsSold: 0, outOfStock: 0
  });
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(25);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Helper function to calculate and set stats
  const calculateStats = (productsList) => {
    const totalRetailValue = productsList.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0);
    const outOfStock = productsList.filter(p => (p.quantity || 0) === 0).length;
    setStats({ totalProducts: productsList.length, totalRetailValue, productsSold: 0, outOfStock });
  };

  const handleEditRequest = (product) => setProductToEdit(product);

  const handleDeleteRequest = (product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      // Cloudinary images are not deleted from here in this simple setup.
      // This would typically be handled by a backend function for security.
      // Then delete the product document
      await databases.deleteDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, PRODUCTS_COLLECTION_ID, productToDelete.$id);

      // Update state to remove the product from the UI
      const newProductsList = products.filter(p => p.$id !== productToDelete.$id);
      setProducts(newProductsList);
      calculateStats(newProductsList); // Recalculate stats
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      // In a real app, you might want to fetch the full product docs to get imageIds
      // For now, we assume we can delete without image cleanup or that it's handled server-side
      const deletePromises = selectedProducts.map(id =>
        databases.deleteDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, PRODUCTS_COLLECTION_ID, id)
      );
      await Promise.all(deletePromises);

      const newProductsList = products.filter(p => !selectedProducts.includes(p.$id));
      setProducts(newProductsList);
      calculateStats(newProductsList);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Failed to bulk delete products:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProductUpdated = (updatedProduct) => {
    const newProductsList = products.map(p => p.$id === updatedProduct.$id ? updatedProduct : p);
    setProducts(newProductsList);
    calculateStats(newProductsList); // Recalculate stats
  };

  const fetchProducts = async () => {
    if (!user) return;
    setIsRefreshing(true);
    setSelectedProducts([]); // Clear selection on new fetch
    try {
      const queries = [Query.equal('userId', user.$id)];
      if (searchQuery) {
        queries.push(Query.search('name', searchQuery));
      }
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        queries
      );
      const fetchedProducts = response.documents;
      setProducts(fetchedProducts);
      calculateStats(fetchedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleStatusToggle = async (product) => {
    const newStatus = product.status === 'published' ? 'unpublished' : 'published';
    // Optimistically update UI
    const updatedProducts = products.map(p => p.$id === product.$id ? { ...p, status: newStatus } : p);
    setProducts(updatedProducts);

    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        product.$id,
        { status: newStatus }
      );
    } catch (error) {
      console.error('Failed to update product status:', error);
      // Revert UI on failure
      setProducts(products);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProducts();
  }, [user]); // Initial fetch

  // Refetch when search query changes (with debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchProducts();
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.$id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const goToNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  const goToPreviousPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));

  const tabs = [
    { id: 'products', name: 'Products' },
    { id: 'collections', name: 'Collections' },
    { id: 'featured-brands', name: 'Featured Brands' },
  ];

  return (
    <div>
      <EditProductModal
        isOpen={!!productToEdit}
        onClose={() => setProductToEdit(null)}
        product={productToEdit}
        onProductUpdated={handleProductUpdated}
      />
      <DeleteConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-auto bg-slate-900 text-white rounded-lg shadow-2xl flex items-center gap-4 px-4 py-3 z-40"
          >
            <p className="text-sm font-medium">{selectedProducts.length} selected</p>
            <div className="h-6 w-px bg-slate-700"></div>
            <button onClick={handleBulkDelete} disabled={isDeleting} className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
              <TrashIcon className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button onClick={() => setSelectedProducts([])} className="p-1 rounded-full hover:bg-slate-700 transition-colors">
              <CloseIcon className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="border-b border-slate-200 mb-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <Link href="/products/new" className="bg-[#2EBF83] text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-green-600 transition-colors">
              Add New Product
            </Link>
        </div>
        <div className="mt-4">
          <nav className="-mb-px flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${tab.id === activeTab ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ProductStatCard 
          title="Products" 
          value={stats.totalProducts} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>}
          iconBgColor="bg-blue-500"
        />
        <ProductStatCard 
          title="Total Retail Value" 
          value={stats.totalRetailValue} 
          currency 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          iconBgColor="bg-green-500"
        />
        <ProductStatCard 
          title="Products Sold" 
          value={stats.productsSold} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          iconBgColor="bg-purple-500"
        />
        <ProductStatCard 
          title="Out of Stock" 
          value={stats.outOfStock} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>}
          iconBgColor="bg-red-500"
        />
      </div>

      {/* Main Content based on Tab */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow-sm">
          {/* Action Bar */}
          <div className="p-4 flex flex-col sm:flex-row items-center gap-4 border-b border-slate-200">
            <div className="relative w-full sm:max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border-slate-300 pl-10 pr-2 py-3 shadow-sm focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none sm:text-sm"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                Status <ChevronDownIcon className="h-4 w-4 text-slate-400" />
              </button>
              <button onClick={fetchProducts} disabled={isRefreshing} className="p-2 rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">
                <RefreshIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                      checked={products.length > 0 && selectedProducts.length === products.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Product</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Price</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Stock</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {isLoading ? (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading products...</td></tr>
                ) : currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.$id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                          checked={selectedProducts.includes(product.$id)}
                          onChange={() => handleSelectProduct(product.$id)}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        <div className="flex items-center gap-3">
                          <img src={product.imageUrls?.[0] ? product.imageUrls[0] : '/placeholder.png'} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                          <span className="font-medium text-slate-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">₦{product.price.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{product.quantity > 0 ? `${product.quantity} in stock` : <span className="text-red-500 font-medium">Out of stock</span>}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        <button onClick={() => handleStatusToggle(product)} className={`${product.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'} inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize`}>
                          {product.status}
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={() => handleEditRequest(product)} className="p-1 text-slate-500 hover:text-green-600"><PencilIcon className="h-5 w-5" /></button>
                        <button onClick={() => handleDeleteRequest(product)} className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-500">No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {products.length > productsPerPage && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Previous</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Next</button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700">
                    Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to <span className="font-medium">{Math.min(indexOfLastProduct, products.length)}</span> of{' '}
                    <span className="font-medium">{products.length}</span> results
                  </p>
                </div>
                <div><button onClick={goToPreviousPage} disabled={currentPage === 1} className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 focus:z-20 disabled:opacity-50">Previous</button><button onClick={goToNextPage} disabled={currentPage === totalPages} className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 focus:z-20 disabled:opacity-50">Next</button></div>
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab !== 'products' && (
        <div className="bg-white rounded-lg shadow-sm text-center text-slate-500 py-24">
          <p className="text-lg font-medium">Coming Soon!</p>
          <p className="text-sm mt-1">This section is under construction.</p>
        </div>
      )}
    </div>
  );
}