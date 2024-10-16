import express, { Request, Response } from 'express';
import { MongoClient, Db, ObjectId } from 'mongodb';
import { connectToAtlasDB, getAtlasDB } from './mongodb';

// Initialize express and middleware
const app = express();
app.use(express.json());

// MongoDB connection
let dbConnectionObject: Db | null = null;

connectToAtlasDB((err?: Error) => {
    if (!err) {
        app.listen(3000, (err?: Error) => {
            if (err) {
                console.log("I am facing some error", err);
            } else {
                console.log("I am active and listening on port 3000");
            }
        });

        dbConnectionObject = getAtlasDB();
    } else {
        console.log("DB connection error", err);
    }
});

// Routes
app.get('/data', async (req: Request, res: Response) => {
    const page = parseInt(req.query.pageNumber as string) || 0;
    const dataPerPage = 10;

    if (dbConnectionObject) {
        try {
            const dataList = await dbConnectionObject.collection('device_data')
                .find()
                .skip(page * dataPerPage)
                .limit(dataPerPage)
                .toArray();

            res.status(200).json(dataList);
            console.log(new Date().toISOString(), "GET request: data was sent back to the browser");
        } catch (err) {
            res.status(500).json("Could not fetch data");
            console.log(new Date().toISOString(), "Could not fetch data", err);
        }
    }
});

app.get('/data/:id', async (req: Request, res: Response) => {
    if (ObjectId.isValid(req.params.id || '')) {
        if (dbConnectionObject) {
            try {
                const doc = await dbConnectionObject.collection('device_data')
                    .findOne({ _id: new ObjectId(req.params.id) });

                if (doc) {
                    res.status(200).json(doc);
                    console.log(new Date().toISOString(), "GET request for data", req.params.id);
                } else {
                    res.status(404).json({ error: "No record found" });
                    console.log(new Date().toISOString(), "GET request for data", req.params.id, "not found");
                }
            } catch (err) {
                res.status(400).json("Could not find the data");
                console.log(new Date().toISOString(), "Error finding the data", err);
            }
        }
    } else {
        res.status(500).json({ error: "Not a valid Document ID" });
        console.log(new Date().toISOString(), "GET request - invalid doc ID", req.params.id);
    }
});

app.post('/data', async (req: Request, res: Response) => {
    const dataBody = req.body;

    if (dataBody && Object.keys(dataBody).length > 0 && dbConnectionObject) {
        try {
            const result = await dbConnectionObject.collection('device_data')
                .insertOne(dataBody);

            res.status(201).json(result);
            console.log(new Date().toISOString(), "POST request - added 1 record to the database");
        } catch (err) {
            res.status(500).json({ error: "Error adding 1 record", details: err });
            console.log(new Date().toISOString(), "[Error] POST request - faced some error", err);
        }
    } else {
        res.status(400).json({ error: "Data body is empty" });
        console.log(new Date().toISOString(), "[Error] No body found in POST request");
    }
});

app.delete('/data/:deleteID', async (req: Request, res: Response) => {
    const id = req.params.deleteID || '';

    if (ObjectId.isValid(id) && dbConnectionObject) {
        try {
            const result = await dbConnectionObject.collection('device_data')
                .deleteOne({ _id: new ObjectId(id) });

            res.status(200).json(result);
            console.log(new Date().toISOString(), "DELETE request - deleted record", id);
        } catch (err) {
            res.status(400).json({ error: "Did not delete record", details: err });
            console.log(new Date().toISOString(), "[Error] did not delete record", err);
        }
    } else {
        res.status(400).json({ error: "Not a valid ID" });
        console.log(new Date().toISOString(), "[Error] Not a valid ID", id);
    }
});
