import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // Your secret API key

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const PROFILES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID;

export { client, databases, Query, DATABASE_ID, PROFILES_COLLECTION_ID };