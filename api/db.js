const { MongoClient } = require('mongodb');

let client;
let tasks;
async function getTasksCollection() {
  if (tasks) return tasks;

  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  tasks = client.db('task-tracker').collection('tasks');
  return tasks;
}

module.exports = { getTasksCollection };
