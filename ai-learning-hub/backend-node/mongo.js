// backend-node/mongo.js
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;
async function connect() {
  if (!db) {
    await client.connect();
    db = client.db("ai_learning_hub");
  }
  return db;
}
module.exports = { connect };
