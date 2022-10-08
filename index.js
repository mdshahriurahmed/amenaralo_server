const express = require('express');
const gallery = require('./gallery')
var cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const mediaCollection = client.db("amenarAlo").collection("Media");
        const storyCollection = client.db("amenarAlo").collection("Story");

        // load all data for gallery
        app.get('/gallery', async (req, res) => {
            const query = {};
            const cursor = galleryCollection.find(query);
            const gallery = await cursor.toArray();
            res.send(gallery);
        })

        // load all media data
        app.get('/media', async (req, res) => {
            const query = {};
            const cursor = mediaCollection.find(query);
            const media = await cursor.toArray();
            res.send(media);
        })

        // load media data by id
        app.get('/media/:_id', async (req, res) => {
            const _id = req.params._id;
            const query = { _id: ObjectId(_id) };
            const media = await mediaCollection.findOne(query);
            res.send(media);

        })
        // load all story data
        app.get('/story', async (req, res) => {
            const query = {};
            const cursor = storyCollection.find(query);
            const media = await cursor.toArray();
            res.send(media);
        })

        // load story data by id
        app.get('/story/:_id', async (req, res) => {
            const _id = req.params._id;
            const query = { _id: ObjectId(_id) };
            const media = await storyCollection.findOne(query);
            res.send(media);

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