import { Collection as CollectionBase, CollectionOptions, Db } from 'mongodb';
import MongoDB from "./index";

export interface CollectionConfig extends CollectionOptions {
   name: string;
   database: string;
   memory?: boolean;
}

export default abstract class Collection {

   private static readonly _collection?: CollectionBase;

   abstract getConfig(): CollectionConfig;

   private static getConfig(): CollectionConfig {
      return this.prototype.getConfig();
   }

   static getCollection(): CollectionBase {
      if (this._collection) {
         return this._collection;
      }
      return this.getDb().collection(this.getCollectionName());
   }

   static getCollectionName(): string {
      return this.getConfig().name;
   }

   static getDatabaseName(): string {
      return this.getConfig().database;
   }

   static getDb(): Db {
      return MongoDB.db(this.getDatabaseName());
   }

}
