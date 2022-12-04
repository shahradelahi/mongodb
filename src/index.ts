import { Db, MongoClient, MongoClientOptions } from "mongodb";
import * as Utils from "./utils";

export type MongoConfig = Utils.AuthParams & MongoClientOptions;

let mongodb: MongoClient | undefined;

export function InitMongo(config: MongoConfig) {
   const options: MongoClientOptions = {};
   const tempConfig: any = {...config};
   const keys = ['hostname', 'port', 'username', 'password', 'database', 'schema'];
   keys.forEach(key => {
      if (tempConfig[key]) {
         tempConfig[key] = tempConfig[key];
      }
   });
   mongodb = auth(tempConfig, options);
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

function auth(params: Utils.AuthParams, options?: MongoClientOptions): MongoClient {
   const url = Utils.makeUrl(params);
   return new MongoClient(url, options);
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

/**
 * Exporting the Collection module
 */
export * from './collection';

/**
 * Exporting the Utils module
 */
export * from './utils';

/**
 * Exporting the Original MongoDB types
 */
export * from './types';

/**
 * Export default MongoDB module
 */
export default MongoDB;
