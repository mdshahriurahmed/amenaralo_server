const express = require('express');

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
        const userCollection = client.db("amenarAlo").collection("Users");
        const currentuserCollection = client.db("amenarAlo").collection("CurrentUsers");

        // add new user

        app.post('/Users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        // update current user info 

        app.post('/CurrentUser/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };

            const options = { upsert: true };
            const cuser = req.body;
            const updateDoc = {
                $set: {
                    plot: cuser
                },
            };
            const result = await currentuserCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // get user pass
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = await currentuserCollection.findOne({ email: email });
            res.send(user);

        })
        // get user information by email
        app.get('/loginuser/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            res.send(user);

        })
        // get all users information
        app.get('/alluser', async (req, res) => {

            const user = await userCollection.find().toArray();
            res.send(user);

        })

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

        // make moderator api
        app.put('/user/make-moderator/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'Moderator' },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // verify user
        app.get('/isuser/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            if (user) {
                res.send(true);
            }
            else {
                res.send(false);
            }

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