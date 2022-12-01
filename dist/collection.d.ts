import { Collection as CollectionBase, CollectionOptions, Db } from 'mongodb';
export interface CollectionConfig extends CollectionOptions {
    name: string;
    database: string;
    memory?: boolean;
}
export default abstract class Collection {
    private static readonly _collection?;
    abstract getConfig(): CollectionConfig;
    private static getConfig;
    static getCollection(): CollectionBase;
    static getCollectionName(): string;
    static getDatabaseName(): string;
    static getDb(): Db;
}
