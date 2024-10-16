import express, { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

const uri = 'mongodb+srv://manasUser:ASUEPICS2024@ecmocluster.g7m07.mongodb.net/ecmo_data?retryWrites=true&w=majority&appName=EcmoCluster'; // MongoDB URI from .env
let dbConnection: any;

// Connect to MongoDB Atlas
async function connectToDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        dbConnection = client.db('YourDatabaseName'); // Replace 'YourDatabaseName' with your DB name
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// GET request: fetch all documents from a collection
app.get('/data', async (req: Request, res: Response) => {
    try {
        const data = await dbConnection.collection('YourCollectionName').find({}).toArray(); // Replace 'YourCollectionName'
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// POST request: insert new data into the collection
app.post('/data', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await dbConnection.collection('YourCollectionName').insertOne(data); // Replace 'YourCollectionName'
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error inserting data' });
    }
});

// DELETE request: delete a document by ID
app.delete('/data/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id || '';
        if (ObjectId.isValid(id) && id.length > 0) {
            const result = await dbConnection.collection('YourCollectionName').deleteOne({ _id: new ObjectId(id) }); // Replace 'YourCollectionName'
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: 'Invalid ID' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting data' });
    }
});

// Start the server and connect to the database
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await connectToDatabase();
});
