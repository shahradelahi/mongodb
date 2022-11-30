import { Db, MongoClient, MongoClientOptions } from "mongodb";
import * as Utils from "./utils";

export type MongoConfig = Utils.AuthParams & MongoClientOptions;

let mongodb: MongoClient | undefined;

export function InitMongo(config: MongoConfig) {
   mongodb = auth(config);
}

async function collectionExists(db: Db, collection: string) {
   const collections = await db.listCollections().toArray();
   return collections.some(({name}) => name === collection);
}

async function databaseExists(dbName: string) {
   if (!mongodb) {
      throw new Error('MongoDB is not initialized');
   }
   const collections = await mongodb.db(dbName)
       .listCollections()
       .toArray();
   return collections.length > 0;
}

async function isConnected(db: Db) {
   try {
      await db.command({ping: 1});
      return true;
   } catch (e) {
      return false;
   }
}

async function connect(database?: string): Promise<Db | undefined> {
   if (!mongodb) {
      throw new Error('MongoDB is not initialized');
   }
   await mongodb.connect();
   return mongodb.db(database);
}

async function disconnect() {
   if (!mongodb) {
      throw new Error('MongoDB is not initialized');
   }
   await mongodb.close();
}

function db(database: string): Db {
   if (!mongodb) {
      throw new Error('MongoDB is not initialized');
   }
   const db = mongodb.db(database);
   !isConnected(db) && connect(database);
   return db;
}

function auth(params: Utils.AuthParams): MongoClient {
   return new MongoClient(Utils.makeUrl(params));
}

async function renameDatabase(dbName: string, newDbName: string) {
   if (!mongodb) {
      throw new Error('MongoDB is not connected');
   }
   const db = mongodb.db(dbName);
   const newDb = mongodb.db(newDbName);
   if (await databaseExists(newDbName)) {
      throw new Error(`Database "${newDbName}" already exists`);
   }
   if (!await databaseExists(dbName)) {
      throw new Error(`Database "${dbName}" doesn't exist`);
   }
   if (dbName === newDbName) {
      throw new Error(`Database names are the same`);
   }
   const collections = await db.listCollections().toArray();
   for (const {name} of collections) {
      const docs = await db.collection(name).find().toArray();
      await newDb.createCollection(name);
      if (docs.length > 0) {
         await newDb.collection(name).insertMany(docs);
      }
      await db.collection(name).drop();
   }
   await db.dropDatabase();
   return newDb;
}

export const MongoDB = {
   auth,
   connect,
   disconnect,
   isConnected,
   db,
   renameDatabase,
   collectionExists,
   utils: Utils
}

export default MongoDB;
