"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeConnectionString = exports.toObject = void 0;
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
function makeConnectionString(config) {
    var username = config.username, password = config.password, hostname = config.hostname, port = config.port, database = config.database;
    var portStr = config.schema === 'mongodb+srv' ? '' : ":".concat((port === null || port === void 0 ? void 0 : port.toString()) || '27017');
    var schema = config.schema || 'mongodb';
    var paramsString = '';
    if (config.params) {
        paramsString += '/?';
        Object.keys(config.params).forEach(function (key) {
            paramsString += "".concat(key, "=").concat(config.params ? config.params[key] : '', "&");
        });
        paramsString = paramsString.slice(0, -1);
    }
    var base = "".concat(schema, "://").concat(hostname).concat(portStr).concat(paramsString);
    if (username && password) {
        base = "".concat(schema, "://").concat(username, ":").concat(password, "@").concat(hostname).concat(portStr).concat(paramsString);
    }
    return database ? "".concat(base, "/").concat(database) : base;
}
exports.makeConnectionString = makeConnectionString;
//# sourceMappingURL=utils.js.map