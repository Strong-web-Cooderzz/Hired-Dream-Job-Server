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
        

        app.get('/jobs',async(req,res)=>{
            const result = await jobsCollection.find({}).toArray();
            res.send(result)
        })


    }
    finally{}
}

run().catch(err=>{
    console.error(err);
})


app.listen(port,()=>{
    console.log('server running on:', port)
})