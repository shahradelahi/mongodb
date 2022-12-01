"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = exports.InitMongo = void 0;
var mongodb_1 = require("mongodb");
var Utils = __importStar(require("./utils"));
var mongodb;
function InitMongo(config) {
    var options = {};
    var tempConfig = __assign({}, config);
    var keys = ['hostname', 'port', 'username', 'password', 'database', 'schema'];
    keys.forEach(function (key) {
        if (tempConfig[key]) {
            tempConfig[key] = tempConfig[key];
        }
    });
    mongodb = auth(tempConfig, options);
}
exports.InitMongo = InitMongo;
function collectionExists(db, collection) {
    return __awaiter(this, void 0, void 0, function () {
        var collections;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.listCollections().toArray()];
                case 1:
                    collections = _a.sent();
                    return [2 /*return*/, collections.some(function (_a) {
                            var name = _a.name;
                            return name === collection;
                        })];
            }
        });
    });
}
function databaseExists(dbName) {
    return __awaiter(this, void 0, void 0, function () {
        var collections;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mongodb) {
                        throw new Error('MongoDB is not initialized');
                    }
                    return [4 /*yield*/, mongodb.db(dbName)
                            .listCollections()
                            .toArray()];
                case 1:
                    collections = _a.sent();
                    return [2 /*return*/, collections.length > 0];
            }
        });
    });
}
function isConnected(db) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.command({ ping: 1 })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function connect(database) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mongodb) {
                        throw new Error('MongoDB is not initialized');
                    }
                    return [4 /*yield*/, mongodb.connect()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, mongodb.db(database)];
            }
        });
    });
}
function disconnect() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mongodb) {
                        throw new Error('MongoDB is not initialized');
                    }
                    return [4 /*yield*/, mongodb.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function db(database) {
    if (!mongodb) {
        throw new Error('MongoDB is not initialized');
    }
    var db = mongodb.db(database);
    !isConnected(db) && connect(database);
    return db;
}
function auth(params, options) {
    var url = Utils.makeUrl(params);
    return new mongodb_1.MongoClient(url, options);
}
function renameDatabase(dbName, newDbName) {
    return __awaiter(this, void 0, void 0, function () {
        var db, newDb, collections, _i, collections_1, name_1, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mongodb) {
                        throw new Error('MongoDB is not connected');
                    }
                    db = mongodb.db(dbName);
                    newDb = mongodb.db(newDbName);
                    return [4 /*yield*/, databaseExists(newDbName)];
                case 1:
                    if (_a.sent()) {
                        throw new Error("Database \"".concat(newDbName, "\" already exists"));
                    }
                    return [4 /*yield*/, databaseExists(dbName)];
                case 2:
                    if (!(_a.sent())) {
                        throw new Error("Database \"".concat(dbName, "\" doesn't exist"));
                    }
                    if (dbName === newDbName) {
                        throw new Error("Database names are the same");
                    }
                    return [4 /*yield*/, db.listCollections().toArray()];
                case 3:
                    collections = _a.sent();
                    _i = 0, collections_1 = collections;
                    _a.label = 4;
                case 4:
                    if (!(_i < collections_1.length)) return [3 /*break*/, 11];
                    name_1 = collections_1[_i].name;
                    return [4 /*yield*/, db.collection(name_1).find().toArray()];
                case 5:
                    docs = _a.sent();
                    return [4 /*yield*/, newDb.createCollection(name_1)];
                case 6:
                    _a.sent();
                    if (!(docs.length > 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, newDb.collection(name_1).insertMany(docs)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [4 /*yield*/, db.collection(name_1).drop()];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 4];
                case 11: return [4 /*yield*/, db.dropDatabase()];
                case 12:
                    _a.sent();
                    return [2 /*return*/, newDb];
            }
        });
    });
}
exports.MongoDB = {
    auth: auth,
    connect: connect,
    disconnect: disconnect,
    isConnected: isConnected,
    db: db,
    renameDatabase: renameDatabase,
    collectionExists: collectionExists,
    utils: Utils
};
exports.default = exports.MongoDB;
//# sourceMappingURL=index.js.map