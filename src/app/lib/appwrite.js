import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

// Make sure to create these environment variables in your .env.local file
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const PROFILES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID;