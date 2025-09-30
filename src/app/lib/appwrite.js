import { Client, Account, Databases, ID, Functions, Storage, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
export { ID, Query };

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const PROFILES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID;
export const PRODUCTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID;
export const ORDERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID;
export const COLLECTIONS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_COLLECTION_ID;
