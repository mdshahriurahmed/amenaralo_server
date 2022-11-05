const express = require('express');

var cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { request } = require('express');
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
        const classCollection = client.db("amenarAlo").collection("ClassList");
        const childrenCollection = client.db("amenarAlo").collection("Children");
        const sidCollection = client.db("amenarAlo").collection("sId");
        const resultsCollection = client.db("amenarAlo").collection("Results");

        // add new user

        app.post('/Users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })


        // delete a user
        app.delete('/delete-user/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const result = await userCollection.deleteOne(filter);
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



        // update email when changed

        app.put('/usernew1/:mobile', async (req, res) => {
            const mobile = req.params.mobile;
            const filter = { mobile: mobile };
            const newm = req.body;
            const updateDoc = {
                $set: { email: `${newm.email}` },
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

        // this api's for manage children related options
        // add new Childrens

        app.post('/Childrens', async (req, res) => {
            const Children = req.body;
            const result = await childrenCollection.insertOne(Children);
            res.send(result);
        })

        // class list
        app.get('/classes', async (req, res) => {
            const query = {};
            const cursor = classCollection.find(query).project({ clstitle: 1 });
            const classes = await cursor.toArray();
            res.send(classes);
        });

        // current student id
        app.get('/currentid', async (req, res) => {
            const query = {};
            const cursor = sidCollection.find(query).project({ cid: 1 });
            const cid = await cursor.toArray();
            res.send(cid);
        });

        // update current id

        app.post('/currentid/:id', async (req, res) => {
            const id = "635ceb379dfb9c79856d6103";
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const newid = req.body;
            const updateDoc = {
                $set: newid,

            };
            const result = await sidCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // get all childrens information
        app.get('/allchildren', async (req, res) => {
            const user = await childrenCollection.find().toArray();
            res.send(user);
        })
        // get all result request information
        app.get('/resultrequests', async (req, res) => {
            const user = await resultsCollection.find().toArray();
            res.send(user);
        })

        // delete a child
        app.delete('/delete-child/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await childrenCollection.deleteOne(filter);
            res.send(result);
        })

        // find a children
        app.get('/children/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const children = await childrenCollection.findOne(filter);
            res.send(children);
        })


        // insert result

        app.post('/result', async (req, res) => {
            const info = req.body;
            const query = {
                register_id: info.register_id,
                clstitle: info.clstitle,
                exam: info.exam,
            }
            const exists = await resultsCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, booking: exists })
            }
            const result = await resultsCollection.insertOne(info);
            res.send({ success: true, result });
        })

        // find a result details
        app.get('/resultdetails/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await resultsCollection.findOne(filter);
            res.send(result);
        })


        // approve result
        app.put('/approved/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: { status: 'Approved' },
            };
            const result = await resultsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        // decline result
        app.put('/declined/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const cmnt = req.body;
            const updateDoc = {
                $set: { status: 'Declined', comment: `${cmnt.comment}` },
            };
            const result = await resultsCollection.updateOne(filter, updateDoc);
            res.send(result);
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