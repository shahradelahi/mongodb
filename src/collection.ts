import { Collection, CollectionOptions, Db, Document } from 'mongodb';
import MongoDB from "./index";

export interface CollectionConfig extends CollectionOptions {
   name: string;
   database: string | Db;
   memory?: boolean;
}

/**
 * The MongoCollection class is a abstraction of the MongoDB Collection class.
 * It provides a easy way to create and manage collections.
 *
 * @public
 *
 * @example
 * import MongoCollection from "@litehex/mongodb/dist/collection";
 *
 * export class Reservations extends MongoCollection {
 *
 *    getConfig(): CollectionConfig {
 *       return {
 *          name: "reservations",
 *          database: "example",
 *       }
 *    }
 *
 *    static doSomething() {
 *       this.collection().find({}).toArray();
 *    }
 *
 * }
 */
export default abstract class MongoCollection<TSchema = any> {

   private static readonly _collection?: Collection;

   /**
    * Get the collection configuration.
    * **NOTE:** This method must be implemented in the child class.
    *
    * @returns {CollectionConfig} The collection configuration.
    */
   abstract getConfig(): CollectionConfig;

   /**
    * Get the collection configuration.
    * @private
    */
   private static getConfig(): CollectionConfig {
      return this.prototype.getConfig();
   }

   /**
    * Get the collection instance.
    *
    * @returns {Collection<Document>} The collection instance.
    */
   static getCollection(): Collection {
      if (this._collection) {
         return this._collection;
      }
      return this.getDb().collection(this.getCollectionName());
   }

   /**
    * Get the collection name.
    *
    * @returns {string} The collection name.
    */
   static getCollectionName(): string {
      return this.getConfig().name;
   }

   /**
    * Get the database name of the collection.
    *
    * @returns {string} The database name.
    */
   static getDatabaseName(): string {
      if (typeof this.getConfig().database === "string") {
         return this.getConfig().database as string;
      }
      return this.getDb().databaseName;
   }

   /**
    * Get the database instance of the collection.
    *
    * @returns {Db} The database instance.
    */
   static getDb(): Db {
      return MongoDB.db(this.getDatabaseName());
   }

}
