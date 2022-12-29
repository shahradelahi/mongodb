import { MongoClientOptions } from "mongodb";

export type {
   Collection as MongoCollection,
   UpdateResult as MongoUpdateResult,
   BulkWriteOptions,
   Collection,
   CollectionOptions,
   Db,
   DeleteOptions,
   DeleteResult,
   Document,
   FindOptions,
   InsertManyResult,
   InsertOneOptions,
   InsertOneResult,
   MongoError,
   ObjectId
} from "mongodb";

export interface MongoConfig {
   hostname: string
   schema?: string
   port?: string | number
   params?: Record<string, any> & EnchantedOptions
   username?: string
   password?: string
   database?: string
}

export interface EnchantedOptions extends Omit<MongoClientOptions, 'proxyPort'> {
   proxyPort?: number | string
}

export interface ObjectOptions {
   $unset?: string[],
   $set?: Record<string, any>,
   $rename?: Record<string, any>
}
