const express = require('express');
var cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// use midleware
app.use(cors())
app.use(express.json())

// for mongodb connection


const uri = "mongodb+srv://dbamenaralo:sswUjb3Iq5fYfiuS@amenaralo.lt2fb5g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const galleryCollection = client.db("amenarAlo").collection("Gallery");

        // load all data for gallery
        app.get('/gallery', async (req, res) => {
            const query = {};
            const cursor = galleryCollection.find(query);
            const gallery = await cursor.toArray();
            res.send(gallery);
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Amenar Alo Foundation server is running!')
})

app.listen(port, () => {
    console.log(`Amenar Alo Foundation app running on port ${port}`)
})