"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
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
    MongoCollection._updateTimestamps = function (document, isInsert) {
        if (this._getConfig().timestamps) {
            var format = this._getConfig().timestampsFormat || 'Millis';
            var formattedDate = this._formatDate(new Date(), format);
            var fields = this._getConfig().timestampsFields || {
                createdAt: 'createdAt',
                updatedAt: 'updatedAt'
            };
            if (isInsert && fields.createdAt && !document[fields.createdAt]) {
                document[fields.createdAt] = formattedDate;
            }
            if (isInsert && fields.updatedAt && !document[fields.updatedAt]) {
                document[fields.updatedAt] = formattedDate;
            }
            if (!isInsert && fields.updatedAt) {
                if (!document['$set']) {
                    document['$set'] = {};
                }
                if (!document['$set'][fields.updatedAt]) {
                    document['$set'][fields.updatedAt] = formattedDate;
                }
            }
        }
        return document;
    };
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
    MongoCollection._formatDate = function (date, format) {
        switch (format) {
            case 'ISODate':
                return date.toISOString();
            case 'Date':
                return date;
            case 'Unix':
                return Math.floor(date.getTime() / 1000);
            case 'Millis':
                return date.getTime();
            case 'Utc':
                return date.toUTCString();
        }
    };
    /**
     * Get the collection configuration.
     * @private
     */
    MongoCollection._getConfig = function () {
        if (!this.prototype.getConfig) {
            throw new mongodb_1.MongoError("The getConfig() method is not implemented in the child class");
        }
        return this.prototype.getConfig();
    };
    /**
     * Get the collection instance.
     *
     * @returns {Collection<Document>} The collection instance.
     */
    MongoCollection.getCollection = function () {
        return this.getDb().collection(this.getCollectionName());
    };
    /**
     * Get the collection name.
     *
     * @returns {string} The collection name.
     */
    MongoCollection.getCollectionName = function () {
        return this._getConfig().name;
    };
    /**
     * Get the database name of the collection.
     *
     * @returns {string} The database name.
     */
    MongoCollection.getDbName = function () {
        if (typeof this._getConfig().database === "string") {
            return this._getConfig().database;
        }
        if (this._getConfig().database instanceof mongodb_1.Db) {
            return this._getConfig().database.databaseName;
        }
        throw new Error("Invalid typeof database name");
    };
    /**
     * Get the database instance of the collection.
     *
     * @returns {Db} The database instance.
     */
    MongoCollection.getDb = function () {
        var client = this._getConfig().client;
        if (client) {
            return client.db(this.getDbName());
        }
        return index_1.default.db(this.getDbName());
    };
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
    MongoCollection.findOne = function (filter, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getCollection().findOne(filter, options)];
            });
        });
    };
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
    MongoCollection.find = function (filter, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getCollection().find(filter, options)];
            });
        });
    };
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
    MongoCollection.insertOne = function (document, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getCollection().insertOne(this._updateTimestamps(document, true), options)];
            });
        });
    };
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
    MongoCollection.insertMany = function (documents, options) {
        return __awaiter(this, void 0, void 0, function () {
            var newDocuments;
            var _this = this;
            return __generator(this, function (_a) {
                newDocuments = documents.map(function (document) { return _this._updateTimestamps(document, true); });
                return [2 /*return*/, this.getCollection().insertMany(newDocuments, options)];
            });
        });
    };
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
    MongoCollection.updateOne = function (filter, update) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getCollection().updateOne(filter, this._updateTimestamps(update, false))];
            });
        });
    };
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
    MongoCollection.updateMany = function (filter, update, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getCollection().updateMany(filter, this._updateTimestamps(update, false), options)];
            });
        });
    };
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
    MongoCollection.deleteOne = function (filter, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getCollection().deleteOne(filter, options)];
            });
        });
    };
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
    MongoCollection.deleteMany = function (filter, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getCollection().deleteMany(filter, options)];
            });
        });
    };
    return MongoCollection;
}());
exports.default = MongoCollection;
//# sourceMappingURL=collection.js.map