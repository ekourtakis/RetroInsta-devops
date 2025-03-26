// sets up MongoDB server
import {MongoClient} from 'mongodb';
import http from 'http';

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

async function main() {
  try {
    // Connect to Mongo
    await client.connect();
    console.log('Connected to Mongo!');

    // Declare database and collection variables retrieved from client
    const db = client.db(DATABASE_DB);
    const collection = db.collection(DATABASE_COLLECTION);

    // Adds dummy user data to collection
    collection.insertMany([
      { userID: 4, imgURL: "helloworld.com", desc: "This is a new description!", likes: 10 },
      { userID: 5, imgURL: "second.org", desc: "This is also a description! Cool beans.", likes: 4 },
      { userID: 6, imgURL: "another.net", desc: "hi", likes: 0 }
    ]);

    // Create server and listen for requests
    const server = http.createServer();
    // Query Mongo
    server.on('request', async (req, res) => {
      const result = await collection.findOne({});
      if (result == null)
        console.log("failed to find data!");
      res.end(JSON.stringify(result));
    });
    server.listen(SERVER_PORT, SERVER_HOST);
  } catch (err) {
    console.error('Something went wrong', err);
  }
}

main()
  .then(() => console.log('Server started!'))
  .catch(err => console.error('Something went wrong', err));
