"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
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
var MongoCollection = /** @class */ (function () {
    function MongoCollection() {
    }
    /**
     * Get the collection configuration.
     * @private
     */
    MongoCollection.getConfig = function () {
        return this.prototype.getConfig();
    };
    /**
     * Get the collection instance.
     *
     * @returns {Collection<Document>} The collection instance.
     */
    MongoCollection.getCollection = function () {
        if (this._collection) {
            return this._collection;
        }
        return this.getDb().collection(this.getCollectionName());
    };
    /**
     * Get the collection name.
     *
     * @returns {string} The collection name.
     */
    MongoCollection.getCollectionName = function () {
        return this.getConfig().name;
    };
    /**
     * Get the database name of the collection.
     *
     * @returns {string} The database name.
     */
    MongoCollection.getDatabaseName = function () {
        if (typeof this.getConfig().database === "string") {
            return this.getConfig().database;
        }
        return this.getDb().databaseName;
    };
    /**
     * Get the database instance of the collection.
     *
     * @returns {Db} The database instance.
     */
    MongoCollection.getDb = function () {
        return index_1.default.db(this.getDatabaseName());
    };
    return MongoCollection;
}());
exports.default = MongoCollection;
//# sourceMappingURL=collection.js.map