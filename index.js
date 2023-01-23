const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')


require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello Jobs')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://DreamUser:7LKaa1qZ3Gh9BYS9@cluster0.b5doc61.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async()=>{
    try{
        const jobsCollection = client.db('hired-job').collection('jobs')
        const usersCollection = client.db('hired-job').collection('users')
        

        app.get('/jobs',async(req,res)=>{
            const result = await jobsCollection.find({}).toArray();
            res.send(result)
        })
        app.get('/jobs/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await jobsCollection.findOne(query);
            res.send(result)
        })
        app.post('/jobs',async(req,res)=>{
            const jobBody = req.body;
            console.log(jobBody)
            const result = await jobsCollection.insertOne(jobBody);
            res.send(result)
        })

        app.get('/user',async(req,res)=>{
            const email = req.query.email;
            const query = {email: email}
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        app.post('/user',async(req,res)=>{
            const userData = req.body;
            const result = await usersCollection.insertOne(userData)
            res.send(result)
        })

        app.put('/user/:id',async(req,res)=>{
            const id = req.params.id;
            const userData = req.body;
            console.log(userData)
            const filter = {_id: ObjectId(id)}
            const option = {upsert: true}
            const updateUser = {
                $set: userData
            }
            const result = await usersCollection.updateOne(filter,updateUser,option)
            res.send(result)
        })

        app.get('/employ',async(req,res)=>{
            const employ = req.query.type;
            const query = {type: employ}
            console.log(employ)
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/employ/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

		app.get('/find-jobs', async(req, res) => {
			const search = req.query.search;
			const location = req.query.location;
			const searchRe = new RegExp(`.*${search}.*`, 'gi');
			const locationRe = new RegExp(`.*${location}.*`, 'gi');
			const result = await jobsCollection.find({"title": searchRe, "location": locationRe}).toArray();
			res.send(result);
		});

		app.get('/find-employer', async(req, res) => {
			const search = req.query.search;
			const location = req.query.location;
			const searchRe = new RegExp(`.*${search}.*`, 'gi');
			const locationRe = new RegExp(`.*${location}.*`, 'gi');
			const result = await usersCollection.find({"fullName": searchRe, "address": locationRe}).toArray();
			res.send(result);
		});


    }
    finally{}
}

run().catch(err=>{
    console.error(err);
})


app.listen(port,()=>{
    console.log('server running on:', port)
})
