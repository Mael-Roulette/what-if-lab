import { Client, Account, Databases, TablesDB } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  throw new Error("Missing Appwrite env vars (endpoint, project id, API key)");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const account = new Account(client);
const databases = new Databases(client);
const tablesDB = new TablesDB(client);

export { client, account, databases, tablesDB };
