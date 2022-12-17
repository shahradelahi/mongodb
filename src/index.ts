import { Db, MongoClient, MongoClientOptions, MongoRuntimeError } from "mongodb";
import * as Utils from "./utils";
import { makeUrl, MongoConfig } from "./utils";

let _mongodb: MongoClient | undefined;
let _mongoConfig: MongoConfig | undefined;

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

   _mongoConfig = config;

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

   _mongodb = auth(tempConfig, options);
}

/**
 * Get the MongoDB configuration
 *
 * @returns {MongoConfig}
 * @throws {MongoRuntimeError} if MongoDB is not initialized
 */
export function getMongoConfig(): MongoConfig {
   if (!_mongoConfig) {
      throw new MongoRuntimeError('MongoDB is not initialized');
   }
   return _mongoConfig;
}

/**
 * Get the MongoDB client
 *
 * @returns {MongoClient}
 * @throws {MongoRuntimeError} if MongoDB is not initialized
 */
export function getMongoClient(): MongoClient {
   if (!_mongodb) {
      throw new MongoRuntimeError('MongoDB is not initialized');
   }
   return _mongodb;
}

/**
 * Checks if the collection exists in the database
 *
 * @example
 *
 * import { MongoDB } from "@litehex/mongodb";
 *
 * const exists = await MongoDB.collectionExists('litehex', 'users');
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

/**
 * Checks if the database exists in the database
 *
 *
 * @example
 *
 * import { MongoDB } from "@litehex/mongodb";
 *
 * const exists = await MongoDB.databaseExists('litehex');
 *
 * @param {string} dbName
 * @returns {Promise<boolean>}
 */
async function databaseExists(dbName: string): Promise<boolean> {
   if (!_mongodb) {
      throw new Error('MongoDB is not initialized');
   }
   const collections = await _mongodb.db(dbName)
       .listCollections()
       .toArray();
   return collections.length > 0;
}

/**
 * Checks if the database is connected
 *
 * @param {Db} db
 * @returns {Promise<boolean>}
 */
async function isConnected(db: Db): Promise<boolean> {
   try {
      await db.command({ping: 1});
      return true;
   } catch (e) {
      return false;
   }
}

async function connect(database?: string): Promise<Db | undefined> {
   if (!_mongodb) {
      throw new Error('MongoDB is not initialized');
   }
   await _mongodb.connect();
   return _mongodb.db(database);
}

async function disconnect() {
   if (!_mongodb) {
      throw new Error('MongoDB is not initialized');
   }
   await _mongodb.close();
}

function db(database: string): Db {
   if (!_mongodb) {
      throw new Error('MongoDB is not initialized');
   }
   const db = _mongodb.db(database);
   !isConnected(db) && connect(database);
   return db;
}

function auth(params: MongoConfig, options?: MongoClientOptions): MongoClient {
   const url = makeUrl(params);
   return new MongoClient(url, options);
}

async function renameDatabase(dbName: string, newDbName: string) {
   if (!_mongodb) {
      throw new Error('MongoDB is not connected');
   }
   const db = _mongodb.db(dbName);
   const newDb = _mongodb.db(newDbName);
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
   getClient: getMongoClient,
   getConfig: getMongoConfig,
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
