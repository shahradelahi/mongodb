import {
   BulkWriteOptions,
   Collection,
   CollectionOptions,
   Db,
   DeleteOptions,
   DeleteResult,
   Document,
   Filter,
   FindCursor,
   FindOptions,
   InsertManyResult,
   InsertOneOptions,
   InsertOneResult,
   MongoError,
   OptionalId,
   UpdateFilter,
   UpdateOptions,
   UpdateResult as MongoUpdateResult,
   WithId
} from 'mongodb';
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
export default abstract class MongoCollection<TSchema extends Document = Document> {

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
   static getDbName(): string {
      if (typeof this.getConfig().database === "string") {
         return this.getConfig().database as string;
      }
      if (!this.getDb()) {
         throw new MongoError("The given database is not a string and the database is not initialized.");
      }
      return this.getDb().databaseName;
   }

   /**
    * Get the database instance of the collection.
    *
    * @returns {Db} The database instance.
    */
   static getDb(): Db {
      return MongoDB.db(this.getDbName());
   }

   /**
    * Get One document from the collection.
    *
    * @example
    *
    * const user = await Users.findOne <User> ({ _id: "123" });
    *
    * @param {Filter<TSchema>} filter The filter to use.
    * @param {FindOptions<TSchema>} options The options to use.
    *
    * @returns {Promise<Document<TSchema>> | null>} The document.
    */
   static async findOne<TSchema extends Document = any>(filter: Filter<TSchema>, options?: FindOptions<TSchema>): Promise<TSchema | null> {
      return this.getCollection().findOne(filter, options);
   }

   /**
    * Get many documents from the collection.
    *
    * @example
    *
    * const user = await Users.find <User> ({ _id: "123" });
    *
    * @param {Filter<TSchema>} filter The filter to use.
    * @param {FindOptions<TSchema>} options The options to use.
    *
    * @returns {Promise<FindCursor<TSchema>>} The cursor.
    */
   static async find<TSchema extends WithId<Document> = any>(filter: Filter<TSchema>, options?: FindOptions<TSchema>): Promise<FindCursor<TSchema>> {
      return this.getCollection().find(filter, options) as FindCursor<TSchema>;
   }

   /**
    * Insert one document into the collection.
    *
    * @example
    *
    * const user = await Users.insertOne <User> ({ _id: "123", name: "John Doe" });
    *
    * @param {TSchema} document The document to insert.
    * @param {CollectionInsertOneOptions} options The options to use.
    *
    * @returns {Promise<InsertOneWriteOpResult<TSchema>>} The result.
    */
   static async insertOne<TSchema extends Document = any>(document: OptionalId<TSchema>, options?: InsertOneOptions): Promise<InsertOneResult<TSchema>> {
      return this.getCollection().insertOne(document, options as InsertOneOptions);
   }

   /**
    * Insert many documents into the collection.
    *
    * @example
    *
    * const user = await Users.insertMany <User> ([{ _id: "123", name: "John Doe" }, { _id: "123", name: "John Doe" }]);
    *
    * @param {TSchema[]} documents The documents to insert.
    * @param {BulkWriteOptions} options The options to use.
    *
    * @returns {Promise<InsertManyResult<TSchema>>} The result.
    */
   static async insertMany<TSchema extends Document = any>(documents: OptionalId<TSchema>[], options?: BulkWriteOptions): Promise<InsertManyResult<TSchema>> {
      return this.getCollection().insertMany(documents, options as BulkWriteOptions);
   }

   /**
    * Update one document in the collection.
    *
    * @example
    *
    * const user = await Users.updateOne <User> ({ _id: "123" }, { $set: { name: "John Doe" } });
    *
    * @param {Filter<TSchema>} filter The filter to use.
    * @param {UpdateQuery<TSchema>} update The update to use.
    *
    * @returns {Promise<UpdateResult>} The result.
    */
   static async updateOne<TSchema extends Document = any>(filter: Filter<TSchema>, update: UpdateQuery<TSchema>): Promise<UpdateResult> {
      return this.getCollection().updateOne(filter, update);
   }

   /**
    * Update many documents in the collection.
    *
    * @example
    *
    * const user = await Users.updateMany <User> ({ _id: "123" }, { $set: { name: "John Doe" } });
    *
    * @param {Filter<TSchema>} filter The filter to use.
    * @param {UpdateQuery<TSchema>} update The update to use.
    * @param {UpdateOptions} options The options to use.
    *
    * @returns {Promise<UpdateResult>} The result.
    */
   static async updateMany<TSchema extends Document = any>(filter: Filter<TSchema>, update: UpdateQuery<TSchema>, options?: UpdateOptions): Promise<UpdateResult> {
      return this.getCollection().updateMany(filter, update as UpdateFilter<any>, options as UpdateOptions);
   }

   /**
    * Delete one document from the collection.
    *
    * @example
    *
    * const user = await Users.deleteOne <User> ({ _id: "123" });
    *
    * @param {Filter<TSchema>} filter The filter to use.
    * @param {DeleteOptions} options The options to use.
    *
    * @returns {Promise<DeleteResult>} The result.
    */
   static async deleteOne<TSchema extends Document = any>(filter: Filter<TSchema>, options?: DeleteOptions): Promise<DeleteResult> {
      return this.getCollection().deleteOne(filter, options as DeleteOptions);
   }

   /**
    * Delete many documents from the collection.
    *
    * @example
    *
    * const user = await Users.deleteMany <User> ({ _id: "123" });
    *
    * @param {Filter<TSchema>} filter The filter to use.
    * @param {DeleteOptions} options The options to use.
    *
    * @returns {Promise<DeleteResult>} The result.
    */
   static async deleteMany<TSchema extends Document = any>(filter: Filter<TSchema>, options?: DeleteOptions): Promise<DeleteResult> {
      return this.getCollection().deleteMany(filter, options as DeleteOptions);
   }

}

export type UpdateQuery<TSchema extends Document = any> = UpdateFilter<TSchema> | Partial<TSchema>;

export type UpdateResult<TSchema extends Document = any> = TSchema | MongoUpdateResult;
