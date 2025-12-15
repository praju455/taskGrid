import { IStorage } from './storage.mongo';
import { MongoStorage } from './storage.mongo';
import { DatabaseStorage } from './storage.postgres';

const kind = (process.env.STORAGE || "mongo").toLowerCase();
let storageInstance: IStorage;

if (kind === "mongo" || kind === "mongodb") {
  storageInstance = new MongoStorage();
} else {
  storageInstance = new DatabaseStorage();
}

export const storage = storageInstance;
