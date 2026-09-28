require('dotenv').config();
const http = require('http')
const {MongoClient, ObjectId} = require('mongodb')

const PORT = 3000;

const client = new MongoClient(process.env.MONGO_URI)
let tasks

async function start() {
    await client.connect()
    tasks = client.db('task-tracker').collection('tasks');
    console.log('Connected to MongoDb')

    server.listen(PORT, () => {
        console.log('Server running on http://localhost:' + PORT)
    })
}

function readBody(req, callback) {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', () => {
        callback(JSON.parse(data));
    })
}


const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PORT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/tasks') {
        const allTasks = await tasks.find().toArray();
        res.end(JSON.stringify(allTasks))
        return;
    }

    if (req.method === 'POST' && req.url === '/tasks') {
        readBody(req, async (body) => {
            await tasks.insertOne({title: body.title, completed: false})
            res.writeHead(201, {'Content-Type' : 'application/json'});
        })
        return;
    }

    if (req.method === 'DELETE' && req.url.startsWith('/tasks/')){
        const id = req.url.split('/') [2];
        await tasks.deleteOne({ _id: new ObjectId(id)});
        res.writeHead(200, { 'Content-Type' : 'application/json'});
        res.end(JSON.stringify({message: 'Task deleted'}))
        return;
    }

    res.writeHead(404, {'Conten-Type' : 'application/json'})
    res.end(JSON.stringify({ error: 'Not found'}));
});

start();
