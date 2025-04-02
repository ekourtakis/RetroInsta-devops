// sets up MongoDB server
import {MongoClient} from 'mongodb';
import express from 'express';
import cors from 'cors';

// const DATABASE_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
// const DATABASE_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
const DATABASE_DB = process.env.MONGO_INITDB_DATABASE;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_COLLECTION = process.env.DATABASE_COLLECTION;

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

const URI = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}`;
const client = new MongoClient(URI);

const app = express();
// Enable CORS to allow requests from your React frontend
app.use(cors());

async function main() {
  try {
    // Connect to Mongo
    await client.connect();
    console.log('Connected to Mongo!');

    // Declare database and collection variables retrieved from client
    const db = client.db(DATABASE_DB);
    const collection = db.collection(DATABASE_COLLECTION);

    // FOR TESTING ONLY: resets collection
    collection.drop();

    // Adds dummy user data to empty collection
    const count = await collection.count();
    if (count === 0) {
      collection.insertMany([
        { id: 1, username: "abby123", profilePicPath: "/testimage/avatar.jpeg", imagePath: "/testimage/mountain.jpeg", description: "Check out this beautiful photo!" },
        { id: 2, username: "benny_2000", profilePicPath: "/testimage/man.jpeg", imagePath: "/testimage/bridge.jpeg", description: "This is a description! Cool beans." },
        { id: 3, username: "char1ieIsC00L", profilePicPath: "/testimage/avatar.jpeg", imagePath: "/testimage/man.jpeg", description: "hi benny" }
      ]);
    }

    // API route to fetch data
    app.get("/api/data", async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

  // launches HTTP server
  app.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}`);
  });

  } catch (err) {
    console.error('Something went wrong', err);
  }
}

main()
  .then(() => console.log('Server started!'))
  .catch(err => console.error('Something went wrong', err));
