"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToAtlasDB = connectToAtlasDB;
exports.getAtlasDB = getAtlasDB;
const mongodb_1 = require("mongodb");
// Ensure that the password doesn't contain special characters
// Ensure to set up a user with permissions only for reading and writing in the database
const uri = "mongodb+srv://manasUser:ASUEPICS2024@ecmocluster.g7m07.mongodb.net/ecmo_data?retryWrites=true&w=majority&appName=EcmoCluster";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let dbConnectionObject = null;
async function connectToAtlasDB(callback) {
    try {
        const client = new mongodb_1.MongoClient(uri, {
            serverApi: {
                version: mongodb_1.ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        dbConnectionObject = client.db('EcmoCluster');
        console.log(dbConnectionObject.databaseName, "connected");
        return callback();
    }
    catch (error) {
        console.log("Error connecting to MongoDB", error);
        return callback(error);
    }
}
function getAtlasDB() {
    return dbConnectionObject;
}
console.log(connectToAtlasDB(() => { }));
