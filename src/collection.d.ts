import { BulkWriteOptions, Collection, CollectionOptions, Db, DeleteOptions, DeleteResult, Document, FindOptions, InsertManyResult, InsertOneOptions, InsertOneResult, MongoClient, UpdateOptions } from 'mongodb';
import { Filter, FindCursor, LeastOne, OptionalId, UpdateQuery, UpdateResult } from "./index";
export interface CollectionConfig extends CollectionOptions {
    name: string;
    database: string | Db;
    client?: MongoClient;
    timestamps?: boolean;
    timestampsFormat?: 'ISODate' | 'Millis' | 'Unix' | 'Date' | 'Utc';
    timestampsFields?: LeastOne<{
        createdAt: string;
        updatedAt: string;
    }>;
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
    private static _updateTimestamps;
    /**
     * Date Formats:
     *
     * ISODate: "2022-12-05T04:14:52.618Z"
     * Date: 2022-12-05T04:14:52.618Z
     * Unix: 163869729261
     * Millis: 1638697292618
     * Utc: "Mon, 05 Dec 2022 04:14:52 GMT"
     *
     * @param {Date} date The date to format.
     * @param {string} format The format to use.
     * @private
     */
    private static _formatDate;
    /**
     * Get the collection configuration.
     *
     * **NOTE:** This method must be implemented in the child class.
     *
     * @returns {CollectionConfig} The collection configuration.
     */
    abstract getConfig(): CollectionConfig;
    /**
     * Get the collection configuration.
     * @private
     */
    private static _getConfig;
    /**
     * Get the collection instance.
     *
     * @returns {Collection<Document>} The collection instance.
     */
    static getCollection<TSchema extends Document = Document>(): Collection<TSchema>;
    /**
     * Get the collection name.
     *
     * @returns {string} The collection name.
     */
    static getCollectionName(): string;
    /**
     * Get the database name of the collection.
     *
     * @returns {string} The database name.
     */
    static getDbName(): string;
    /**
     * Get the database instance of the collection.
     *
     * @returns {Db} The database instance.
     */
    static getDb(): Db;
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
    static findOne<TSchema extends Document = any>(filter: Filter<TSchema>, options?: FindOptions<TSchema>): Promise<TSchema | null>;
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
    static find<TSchema extends Document = any>(filter: Filter<TSchema>, options?: FindOptions<TSchema>): Promise<FindCursor<TSchema>>;
    /**
     * Insert one document into the collection.
     *
     * @example
     *
     * const user = await Users.insertOne <User> ({ _id: "123", name: "John Doe" });
     *
     * @param {TSchema} document The document to insert.
     * @param {InsertOneOptions} options The options to use.
     *
     * @returns {Promise<InsertOneResult<TSchema>>} The result.
     */
    static insertOne<TSchema extends Document = any>(document: OptionalId<TSchema>, options?: InsertOneOptions): Promise<InsertOneResult<TSchema>>;
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
    static insertMany<TSchema extends Document = any>(documents: OptionalId<TSchema>[], options?: BulkWriteOptions): Promise<InsertManyResult<TSchema>>;
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
    static updateOne<TSchema extends Document = any>(filter: Filter<TSchema>, update: UpdateQuery<TSchema>): Promise<UpdateResult>;
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
    static updateMany<TSchema extends Document = any>(filter: Filter<TSchema>, update: UpdateQuery<TSchema>, options?: UpdateOptions): Promise<UpdateResult>;
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
    static deleteOne<TSchema extends Document = any>(filter: Filter<TSchema>, options?: DeleteOptions): Promise<DeleteResult>;
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
    static deleteMany<TSchema extends Document = any>(filter: Filter<TSchema>, options?: DeleteOptions): Promise<DeleteResult>;
}
