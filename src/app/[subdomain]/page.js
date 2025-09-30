import { databases, Query, PROFILES_COLLECTION_ID, DATABASE_ID } from '@/app/lib/appwrite-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';

async function getStoreData(subdomain) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      [Query.equal('subdomain', subdomain)]
    );

    if (response.total === 0) {
      return null;
    }

    const profile = response.documents[0];
   

    return { profile, products: [] }; // Placeholder for products
  } catch (error) {
    console.error('Failed to fetch store data:', error);
    return null;
  }
}

export default async function StorePage({ params }) {
  const { subdomain } = params;
  const storeData = await getStoreData(subdomain);

  if (!storeData) {
    notFound();
  }

  const { profile, products } = storeData;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center my-8">
        {/* You can add a logo here later */}
        <h1 className="text-4xl font-bold text-slate-900">{profile.businessName}</h1>
        <p className="text-slate-500 mt-2">Welcome to our store!</p>
      </header>

      <main className="text-center text-slate-500 py-16 bg-slate-50 rounded-lg">
        <p className="text-lg">Our products will be displayed here soon.</p>
        <p className="text-sm mt-2">Check back later!</p>
      </main>
    </div>
  );
}