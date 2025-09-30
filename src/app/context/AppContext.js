'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, PROFILES_COLLECTION_ID, Query } from '@/app/lib/appwrite';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const loggedInUser = await account.get();
        setUser(loggedInUser);
        
        // Fetch user profile
        const profileResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          PROFILES_COLLECTION_ID, // Make sure you have a PROFILES_COLLECTION_ID export
          [Query.equal('userId', loggedInUser.$id)]
        );
        if (profileResponse.documents.length > 0) {
          setProfile(profileResponse.documents[0]);
          // Optional: Automatically show walkthrough for new users
          // if (profileResponse.documents[0].isNewUser) {
          //   setShowWalkthrough(true);
          // }
        }
      } catch (error) {
        setUser(null);
        setProfile(null);
        router.push('/login'); // Redirect to login if not authenticated
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const value = {
    user,
    profile,
    isLoading,
    setIsLoading,
    showWalkthrough,
    setShowWalkthrough,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);