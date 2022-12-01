"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var Collection = /** @class */ (function () {
    function Collection() {
    }
    Collection.getConfig = function () {
        return this.prototype.getConfig();
    };
    Collection.getCollection = function () {
        if (this._collection) {
            return this._collection;
        }
        return this.getDb().collection(this.getCollectionName());
    };
    Collection.getCollectionName = function () {
        return this.getConfig().name;
    };
    Collection.getDatabaseName = function () {
        return this.getConfig().database;
    };
    Collection.getDb = function () {
        return index_1.default.db(this.getDatabaseName());
    };
    return Collection;
}());
exports.default = Collection;
//# sourceMappingURL=collection.js.map