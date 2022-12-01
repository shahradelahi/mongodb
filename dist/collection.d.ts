import { Collection, CollectionOptions, Db } from 'mongodb';
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
    private static readonly _collection?;
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
    private static getConfig;
    /**
     * Get the collection instance.
     *
     * @returns {Collection<Document>} The collection instance.
     */
    static getCollection(): Collection;
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
    static getDatabaseName(): string;
    /**
     * Get the database instance of the collection.
     *
     * @returns {Db} The database instance.
     */
    static getDb(): Db;
}
