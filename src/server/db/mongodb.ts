import { MongoClient, Db, ServerApiVersion } from 'mongodb';

// Ensure that the password doesn't contain special characters
// Ensure to set up a user with permissions only for reading and writing in the database

const uri = "mongodb+srv://manasUser:ASUEPICS2024@ecmocluster.g7m07.mongodb.net/ecmo_data?retryWrites=true&w=majority&appName=EcmoCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

let dbConnectionObject: Db | null = null;

async function connectToAtlasDB(callback: (error?: Error) => void): Promise<void> {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        dbConnectionObject = client.db('EcmoCluster');

        console.log(dbConnectionObject.databaseName, "connected");

        return callback();
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        return callback(error as Error);
    }
}

function getAtlasDB(): Db | null {
    return dbConnectionObject;
}

console.log(connectToAtlasDB(() => {}));

export {
    connectToAtlasDB,
    getAtlasDB
};
