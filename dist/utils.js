"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUrl = exports.toObject = void 0;
function toObject(doc, exec) {
    if (exec === void 0) { exec = {}; }
    if (!doc) {
        return doc;
    }
    var $unset = exec.$unset, $set = exec.$set, $rename = exec.$rename;
    $unset && $unset.forEach(function (key) {
        if (Object.keys(doc).includes(key)) {
            delete doc[key];
        }
        else {
            if (key.includes('.')) {
                var keys_1 = key.split('.');
                keys_1.reduce(function (acc, cur, index) {
                    if (index === keys_1.length - 1) {
                        if (acc && Object.keys(acc).includes(cur)) {
                            delete acc[cur];
                        }
                        else {
                            return acc;
                        }
                    }
                    return acc[cur];
                }, doc);
            }
        }
    });
    $set && Object.assign(doc, $set);
    $rename && Object.keys($rename).forEach(function (key) {
        if (Object.keys(doc).includes(key)) {
            doc[$rename[key]] = doc[key];
            delete doc[key];
        }
        else {
            if (key.includes('.')) {
                var keys_2 = key.split('.');
                keys_2.reduce(function (acc, cur, index) {
                    if (index === keys_2.length - 1) {
                        doc[$rename[key]] = acc[cur];
                        delete acc[cur];
                    }
                    return acc[cur];
                }, doc);
            }
        }
    });
    return JSON.parse(JSON.stringify(doc));
}
exports.toObject = toObject;
function makeUrl(params) {
    var username = params.username, password = params.password, hostname = params.hostname, port = params.port, database = params.database;
    var portStr = params.schema === 'mongodb+srv' ? '' : ":".concat(port);
    var schema = params.schema || 'mongodb';
    var paramsString = '';
    if (params.params) {
        paramsString += '?';
        Object.keys(params.params).forEach(function (key) {
            paramsString += "".concat(key, "=").concat(params.params ? params.params : [key], "&");
        });
        paramsString = paramsString.slice(0, -1);
    }
    var base = "".concat(schema, "://").concat(hostname).concat(portStr).concat(paramsString);
    if (username && password) {
        base = "".concat(schema, "://").concat(username, ":").concat(password, "@").concat(hostname).concat(portStr).concat(paramsString);
    }
    return database ? "".concat(base, "/").concat(database) : base;
}
exports.makeUrl = makeUrl;
//# sourceMappingURL=utils.js.map