import { Db, MongoClient, MongoClientOptions } from "mongodb";
import * as Utils from "./utils";
import { MongoConfig } from "./types";
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
export declare function InitMongo(config: MongoConfig): void;
/**
 * Get the MongoDB configuration
 *
 * @returns {MongoConfig}
 * @throws {MongoRuntimeError} if MongoDB is not initialized
 */
export declare function getMongoConfig(): MongoConfig;
/**
 * Get the MongoDB client
 *
 * @returns {MongoClient}
 * @throws {MongoRuntimeError} if MongoDB is not initialized
 */
export declare function getMongoClient(): MongoClient;
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
declare function collectionExists(dbInstance: Db, collection: string): Promise<boolean>;
/**
 * Checks if the database is connected
 *
 * @param {Db} db
 * @returns {Promise<boolean>}
 */
declare function isConnected(db: Db): Promise<boolean>;
declare function connect(database?: string): Promise<Db | undefined>;
/**
 * Disconnect client from MongoDB cluster
 *
 * @param {boolean} force - Closes every connection in the connection pool
 * @returns {Promise<void>}
 */
declare function disconnect(force?: boolean): Promise<void>;
declare function db(database: string): Db;
/**
 * Create a MongoClient instance
 *
 * @param {MongoConfig} config
 * @param {MongoClientOptions} options
 *
 * @returns {MongoClient}
 */
declare function auth(config: MongoConfig, options?: MongoClientOptions): MongoClient;
/**
 * Rename a Database
 *
 * @param {string} dbName
 * @param {string} newDbName
 *
 * @returns {Promise<boolean>}
 */
declare function renameDatabase(dbName: string, newDbName: string): Promise<boolean>;
export declare const MongoDB: {
    auth: typeof auth;
    connect: typeof connect;
    disconnect: typeof disconnect;
    isConnected: typeof isConnected;
    db: typeof db;
    renameDatabase: typeof renameDatabase;
    collectionExists: typeof collectionExists;
    getClient: typeof getMongoClient;
    getConfig: typeof getMongoConfig;
    utils: typeof Utils;
};
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
