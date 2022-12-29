import { Db, MongoClient, MongoClientOptions, MongoError, MongoRuntimeError } from "mongodb";
import * as Utils from "./utils";
import { makeConnectionString } from "./utils";
import { MongoConfig } from "./types";

let _mongodb: MongoClient | undefined;
let _mongoConfig: MongoConfig | undefined;
const _instances: Record<string, MongoClient> = {};

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

   const tempConfig: any = { ...config };

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
 * @param {Db} dbInstance
 * @param {string} collection
 *
 * @returns {Promise<boolean>}
 */
async function collectionExists(dbInstance: Db, collection: string): Promise<boolean> {

   const collections = await dbInstance.listCollections().toArray();

   return collections.some(({ name }) => {
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
 * @param {MongoClient?} clientInstance
 *
 * @returns {Promise<boolean>}
 */
async function databaseExists(dbName: string, clientInstance?: MongoClient): Promise<boolean> {

   const client = clientInstance || _mongodb;

   if (!client) {
      throw new MongoError('Client has not been initialized');
   }

   const databases = await client.db().admin().listDatabases();

   return databases.databases.some(({ name }) => {
      return name === dbName;
   });
}

/**
 * Checks if the database is connected
 *
 * @param {Db} db
 * @returns {Promise<boolean>}
 */
async function isConnected(db: Db): Promise<boolean> {
   try {
      await db.command({ ping: 1 });
      return true;
   } catch (e) {
      return false;
   }
}

async function connect(database?: string): Promise<Db | undefined> {
   if (!_mongodb) {
      throw new MongoError('MongoClient has not been initialized');
   }
   await _mongodb.connect();
   return _mongodb.db(database);
}

/**
 * Disconnect client from MongoDB cluster
 *
 * @param {boolean} force - Closes every connection in the connection pool
 * @returns {Promise<void>}
 */
async function disconnect(force: boolean = false): Promise<void> {
   if (force) {
      await Promise.all(Object.values(_instances).map(client => client.close()));
      return;
   }

   if (_mongodb) {
      await _mongodb.close();
   }
}

function db(database: string): Db {
   if (!_mongodb) {
      throw new MongoError('MongoClient has not been initialized');
   }
   const db = _mongodb.db(database);
   !isConnected(db) && connect(database);
   return db;
}

/**
 * Create a MongoClient instance
 *
 * @param {MongoConfig} config
 * @param {MongoClientOptions} options
 *
 * @returns {MongoClient}
 */
function auth(config: MongoConfig, options?: MongoClientOptions): MongoClient {

   const url = makeConnectionString(config);
   const instants = new MongoClient(url, options);

   if (!_instances[url]) {
      _instances[url] = instants;
   }

   return _instances[url];
}

/**
 * Rename a Database
 *
 * @param {string} dbName
 * @param {string} newDbName
 *
 * @returns {Promise<boolean>}
 */
async function renameDatabase(dbName: string, newDbName: string): Promise<boolean> {
   if (!_mongodb) {
      throw new MongoError('MongoClient has not been initialized');
   }

   const db = _mongodb.db(dbName);
   const newDb = _mongodb.db(newDbName);

   if (await databaseExists(newDbName)) {
      throw new MongoRuntimeError(`Database "${newDbName}" already exists`);
   }

   if (!await databaseExists(dbName)) {
      throw new MongoRuntimeError(`Database "${dbName}" doesn't exist`);
   }

   if (dbName === newDbName) {
      throw new MongoRuntimeError(`Another database with the same name "${dbName}" already exists`);
   }

   const collections = await db.listCollections().toArray();

   for (const { name } of collections) {
      const docs = await db.collection(name).find().toArray();
      await newDb.createCollection(name);

      if (docs.length > 0) {
         await newDb.collection(name).insertMany(docs);
      }

      await db.collection(name).drop();
   }

   await db.dropDatabase();

   return !!newDb
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
