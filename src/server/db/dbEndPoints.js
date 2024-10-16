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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var mongodb_2 = require("./mongodb");
// Initialize express and middleware
var app = (0, express_1.default)();
app.use(express_1.default.json());
// MongoDB connection
var dbConnectionObject = null;
(0, mongodb_2.connectToAtlasDB)(function (err) {
    if (!err) {
        app.listen(3000, function (err) {
            if (err) {
                console.log("I am facing some error", err);
            }
            else {
                console.log("I am active and listening on port 3000");
            }
        });
        dbConnectionObject = (0, mongodb_2.getAtlasDB)();
    }
    else {
        console.log("DB connection error", err);
    }
});
// Routes
app.get('/data', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, dataPerPage, dataList, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = parseInt(req.query.pageNumber) || 0;
                dataPerPage = 10;
                if (!dbConnectionObject) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbConnectionObject.collection('device_data')
                        .find()
                        .skip(page * dataPerPage)
                        .limit(dataPerPage)
                        .toArray()];
            case 2:
                dataList = _a.sent();
                res.status(200).json(dataList);
                console.log(new Date().toISOString(), "GET request: data was sent back to the browser");
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(500).json("Could not fetch data");
                console.log(new Date().toISOString(), "Could not fetch data", err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/data/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var doc, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!mongodb_1.ObjectId.isValid(req.params.id || '')) return [3 /*break*/, 5];
                if (!dbConnectionObject) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbConnectionObject.collection('device_data')
                        .findOne({ _id: new mongodb_1.ObjectId(req.params.id) })];
            case 2:
                doc = _a.sent();
                if (doc) {
                    res.status(200).json(doc);
                    console.log(new Date().toISOString(), "GET request for data", req.params.id);
                }
                else {
                    res.status(404).json({ error: "No record found" });
                    console.log(new Date().toISOString(), "GET request for data", req.params.id, "not found");
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(400).json("Could not find the data");
                console.log(new Date().toISOString(), "Error finding the data", err_2);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(500).json({ error: "Not a valid Document ID" });
                console.log(new Date().toISOString(), "GET request - invalid doc ID", req.params.id);
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
app.post('/data', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dataBody, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dataBody = req.body;
                if (!(dataBody && Object.keys(dataBody).length > 0 && dbConnectionObject)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbConnectionObject.collection('device_data')
                        .insertOne(dataBody)];
            case 2:
                result = _a.sent();
                res.status(201).json(result);
                console.log(new Date().toISOString(), "POST request - added 1 record to the database");
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(500).json({ error: "Error adding 1 record", details: err_3 });
                console.log(new Date().toISOString(), "[Error] POST request - faced some error", err_3);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ error: "Data body is empty" });
                console.log(new Date().toISOString(), "[Error] No body found in POST request");
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
app.delete('/data/:deleteID', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.deleteID || '';
                if (!(mongodb_1.ObjectId.isValid(id) && dbConnectionObject)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbConnectionObject.collection('device_data')
                        .deleteOne({ _id: new mongodb_1.ObjectId(id) })];
            case 2:
                result = _a.sent();
                res.status(200).json(result);
                console.log(new Date().toISOString(), "DELETE request - deleted record", id);
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                res.status(400).json({ error: "Did not delete record", details: err_4 });
                console.log(new Date().toISOString(), "[Error] did not delete record", err_4);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ error: "Not a valid ID" });
                console.log(new Date().toISOString(), "[Error] Not a valid ID", id);
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
