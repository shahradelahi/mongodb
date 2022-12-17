import { Db, MongoClient, MongoClientOptions } from "mongodb";
import { MongoConfig, makeUrl } from "./utils";
import * as Utils from "./utils";

let mongodb: MongoClient | undefined;

/**
 * Initialize the MongoDB client and automatically connect to the database
 *
 * @example
 *
 * import { InitMongo, MongoDB } from "@litehex/mongodb";
 *
 * InitMongo({
 *   hostname: 'localhost',
 *   username: 'root',
 *   password: '123456',
 * })
 *
 * // Also you can export the MongoDB client to use it in other files
 * export { MongoDB } from "@litehex/mongodb";
 *
 * @param {MongoConfig} config
 * @returns void
 */
export function InitMongo(config: MongoConfig): void {

   const options: MongoClientOptions = {};

   const tempConfig: any = {...config};

   const keys = [
      'hostname',
      'port',
      'username',
      'password',
      'database',
      'schema'
   ];

   keys.forEach(key => {
      if (tempConfig[key]) {
         tempConfig[key] = tempConfig[key];
      }
   });

   mongodb = auth(tempConfig, options);
}

/**
 * Checks if the collection exists in the database
 *
 * @example
 *
 * import { MongoDB } from "@litehex/mongodb";
 *
 * const exists = await MongoDB.utils.collectionExists('litehex', 'users');
 *
 * @param {string|Db} database
 * @param {string} collection
 *
 * @returns {Promise<boolean>}
 */
async function collectionExists(database: string | Db, collection: string): Promise<boolean> {

   let db: Db = typeof database === 'string' ? MongoDB.db(database) : database;

   const collections = await db.listCollections().toArray();

   return collections.some(({name}) => {
      return name === collection;
   });
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

function auth(params: MongoConfig, options?: MongoClientOptions): MongoClient {
   const url = makeUrl(params);
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
