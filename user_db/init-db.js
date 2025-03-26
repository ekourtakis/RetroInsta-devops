// TODO: find way to have files in MongoDB container (using '/docker-entrypoint-initdb.d/')
// to make changes directly to database

const DATABASE_DB = process.env.MONGO_INITDB_DATABASE;
const DATABASE_COLLECTION = process.env.DATABASE_COLLECTION;

const dbo = db.getSiblingDB(DATABASE_DB);

db.createCollection(DATABASE_COLLECTION)
db.collection(DATABASE_COLLECTION).insertMany([
  { userID: 1, imgURL: "helloworld.com", desc: "This is a description!", likes: 10 },
  { userID: 2, imgURL: "second.org", desc: "This is also description! Cool beans.", likes: 4 },
  { userID: 3, imgURL: "another.net", desc: "hi", likes: 0 }
]);

console.log("Added dummy data!!");