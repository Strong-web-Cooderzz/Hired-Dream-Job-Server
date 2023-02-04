const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51M6FsBLZ3fbZi8VUMpanZHl2iofYhhfuaS0rf480kvRvJOAd1IX2hi0RfEYWL5cnkosFLUUVR2a3DuuQd8BAL1tV007WmiFBlu"
);

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.sendStatus(200);
});



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://DreamUser:7LKaa1qZ3Gh9BYS9@cluster0.b5doc61.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async()=>{
    try{
        //================= Database all collection part ====================//
        const jobsCollection = client.db('hired-job').collection('jobs')
        const usersCollection = client.db('hired-job').collection('users')
        const applyJobCollection = client.db('hired-job').collection('applyjobs')
        

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://DreamUser:7LKaa1qZ3Gh9BYS9@cluster0.b5doc61.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    //================= Database all collection part ====================//
    const jobsCollection = client.db("hired-job").collection("jobs");
    const usersCollection = client.db("hired-job").collection("users");
    const applyJobCollection = client.db("hired-job").collection("applyjobs");
    const featuredJobCollection = client
      .db("hired-job")
      .collection("featuredJob");

    //---------------- Jobs part start here ---------------------//
		app.get('/jobs',async(req,res)=>{
			const limit = Number(req.query.limit);
			if (limit) {
				const result = await jobsCollection.find({}).limit(limit).toArray();
				res.send(result)
			} else {
				const result = await jobsCollection.find({}).toArray();
				res.send(result)
			}
		})
            //  job find by email
        app.get('/jobsFindByEmail',async(req,res)=>{
            const email = req.query.email;
            const filter = {jobEmail:email}
            const result = await jobsCollection.find(filter).toArray();
            res.send(result)
        })

    // Job find by id

    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });

    // Post job
    app.post("/jobs", async (req, res) => {
      const jobBody = req.body;

      const date = new Date();
      jobBody.postTime = date;
      const result = await jobsCollection.insertOne(jobBody);
      res.send(result);
    });

    // JOb Visibility Update

    app.patch("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body.isVisible;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateJob = {
        $set: { isVisible: body },
      };
      const result = await jobsCollection.updateOne(filter, updateJob, option);
      res.send(result);
    });

    // JOb Update

    app.patch("/jobsUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateJob = {
        $set: body,
      };
      const result = await jobsCollection.updateOne(filter, updateJob, option);
      res.send(result);
    });

    // Delete

        app.delete('/deleteJob/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const result = await jobsCollection.deleteOne(filter)
            res.send(result)
        })
         
        // ------apply job section ---------\\
		app.post('/candidate/applyjobs', async(req,res ) => {
			const jobReq = req.body;
			// converts base64 string to binary
			jobReq.candidateResume = Buffer.from(jobReq.candidateResume, 'base64');
			const saveJobApply = await applyJobCollection.insertOne(jobReq);
			res.send(saveJobApply)
		})  

    // ------apply job section ---------\\
    app.post("/candidate/applyjobs", async (req, res) => {
      const jobReq = req.body;
      const saveJobApply = await applyJobCollection.insertOne(jobReq);
      res.send(saveJobApply);
    });

    // -------- my all job applied post ---------\\
    app.get("/job-applied-post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { candidateId: id };
      const appliedJobPost = await applyJobCollection.find(query).toArray();
      res.send(appliedJobPost);
    });

    //---------------- Jobs part end here ---------------------//

    // ----------------user part start here------------------------//
    app.get("/user", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const userData = req.body;
      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const userData = req.body;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateUser = {
        $set: userData,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateUser,
        option
      );
      res.send(result);
    });

    // ----------------user part end here------------------------//

    //------------------- Employer part start here -------------------//

    app.get("/employ", async (req, res) => {
      const employ = req.query.type;
      const query = { type: employ };
      console.log(employ);
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/employ/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.put("/employ", async (req, res) => {
      const email = req.query.email;
      const updateData = req.body;
      console.log(updateData, email);
      const filter = { email: email };
      const option = { upsert: true };
      const userData = {
        $set: updateData,
      };
      const result = await usersCollection.updateOne(filter, userData, option);
      res.send(result);
    });

    // Candidate All
    app.get("/candidate", async (req, res) => {
      const candidate = req.query.type;
      const query = { type: candidate };
      console.log(candidate);
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/candidate/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // Candidate Profile Update
    app.put("/candidate", async (req, res) => {
      const email = req.query.email;
      const updateData = req.body;
      const filter = { email: email };
      const option = { upsert: true };
      const userData = {
        $set: updateData,
      };
      const result = await usersCollection.updateOne(filter, userData, option);
      res.send(result);
    });

    app.get("/find-jobs", async (req, res) => {
      const query = req.query;
      const search = req.query.search;
      const location = req.query.location;
      let jobType;
      if (query.type) {
        if (query.type === "all") {
          jobType = new RegExp(`.*`, "gi");
        } else {
          jobType = req.query.type;
        }
      } else {
        // selects everything using regex;
        jobType = new RegExp(`.*`, "gi");
      }
      // checks if search and location exists using regex
      const searchRe = new RegExp(`.*${search}.*`, "gi");
      const locationRe = new RegExp(`.*${location}.*`, "gi");
      let newest;
      if (query.sort === "new" || query.sort == "") {
        // -1 returns desecndeing
        newest = -1;
      } else {
        newest = 1;
      }

      // requires to use UNIX timestamp
      const second = 1000;
      const minute = 60 * second;
      const hour = 60 * minute;
      const day = 24 * hour;
      const now = new Date().getTime();
      const datePosted = parseInt(query.time);
      let time;
      if (datePosted === 0) {
        time = 0;
      } else if (datePosted === hour) {
        time = now - hour;
      } else if (datePosted === day) {
        time = now - day;
      } else if (datePosted === 7 * day) {
        time = now - 7 * day;
      } else if (datePosted === 14 * day) {
        time = now - 14 * day;
      } else if (datePosted === 30 * day) {
        time = now - 30 * day;
      } else {
        time = 0;
      }
      const perPage = parseInt(query["per-page"]);
      const pageNumber = parseInt(query.page);
      console.log(pageNumber);
      const result = await jobsCollection
        .find({
          title: searchRe,
          location: locationRe,
          jobType: jobType,
          postTime: { $gte: new Date(time) },
        })
        .sort({
          postTime: newest,
        })
        .limit(perPage)
        .skip((pageNumber - 1) * perPage)
        .toArray();
      res.send(result);
    });

    app.get("/find-employer", async (req, res) => {
      const search = req.query.search;
      const location = req.query.location;
      const searchRe = new RegExp(`.*${search}.*`, "gi");
      const locationRe = new RegExp(`.*${location}.*`, "gi");
      const result = await usersCollection
        .find({ fullName: searchRe, address: locationRe })
        .toArray();
      res.send(result);
    });
    //------------------- Employer part end  here -------------------//

    // --------------------- Payment -----------------------//
    // app.post("/create-payment-intent", async (req, res) => {
    //   const jobManage = req.body;
    //   const price = parseInt(jobManage.price);
    //   const amount = price * 100;
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amount,
    //     currency: "usd",
    //     payment_method_types: {card: 'card',},
    //   });
    //   res.send({
    //     clientSecret: paymentIntent.client_secret,
    //   });
    // });
    //  ----------------- Payment ---------------//

    // --------------- Featured Job ------------------- //

    app.get("/featured", async (req, res) => {
      const result = await featuredJobCollection.find({}).limit(6).toArray();
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => {
  console.error(err);
});

        app.get('/employ/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await usersCollection.findOne(query)
            res.send(result)
        })


        app.put('/employ',async(req,res)=>{
            const email = req.query.email;
            const updateData = req.body;
            console.log(updateData,email)
            const filter = {email: email}
            const option = {upsert: true}
            const userData = {
                $set:  updateData
            }
            const result = await usersCollection.updateOne(filter,userData,option)
            res.send(result)
        })


        // Candidate All 
        app.get('/candidate',async(req,res)=>{
            const candidate = req.query.type;
            const query = {type: candidate}
            console.log(candidate)
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/candidate/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        // Candidate Profile Update
        app.put('/candidate',async(req,res)=>{
            const email = req.query.email;
            const updateData = req.body;
            console.log(updateData,email)
            const filter = {email: email}
            const option = {upsert: true}
            const userData = {
                $set:  updateData
            }
            const result = await usersCollection.updateOne(filter,userData,option)
            res.send(result)
        })


		app.get('/find-jobs', async(req, res) => {
			const query = req.query;
			const search = req.query.search;
			const location = req.query.location;
			let jobType;
			if(query.type) {
				if(query.type === 'all') {
					jobType = new RegExp(`.*`, 'gi');
				} else {
					jobType = req.query.type;
				}
			} else {
				// selects everything using regex;
				jobType = new RegExp(`.*`, 'gi');
			}
			// checks if search and location exists using regex
			const searchRe = new RegExp(`.*${search}.*`, 'gi');
			const locationRe = new RegExp(`.*${location}.*`, 'gi');
			let newest;
			if (query.sort === 'new' || query.sort == '') {
				// -1 returns desecndeing
				newest = -1;				
			} else {
				newest = 1;
			}

			// requires to use UNIX timestamp
			const second = 1000;
			const minute = 60 * second;
			const hour = 60 * minute;
			const day = 24 * hour;
			const now = new Date().getTime();
			const datePosted = parseInt(query.time);
			let time;
			if (datePosted === 0) {
				time = 0;
			} else if (datePosted === hour) {
				time = now - hour;
			} else if (datePosted === day) {
				time = now - day;
			} else if (datePosted === 7 * day) {
				time = now - (7 * day);
			} else if (datePosted === 14 * day) {
				time = now - (14 * day);
			} else if (datePosted === 30 * day) {
				time = now - (30 * day);
			} else {
				time = 0;
			}
			const perPage = Number(query["per-page"]);
			const pageNumber = parseInt(query.page);
			let category = query.category;
			if (category === '') {
				category =  new RegExp(`.*`, 'gi');
			}
			const result = await jobsCollection.find({
				"title": searchRe, 
				"location": locationRe, 
				"jobType": jobType, 
				"postTime": {"$gte": new Date(time)},
				"isVisible": true,
				category
				}).sort({
					"postTime": newest
				}).limit(perPage).skip((pageNumber - 1) * perPage).toArray();
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

		// sends all user to admin dashboard
		app.get('/api/v1/get/users/', async (req, res) => {
			let userType = req.query.type;
			if(userType === 'candidates') {
				userType = 'Candidate';
			} else if (userType === 'employers') {
				userType = 'Agency';
			} else {
				userType = '';
			}
			const result = await usersCollection.find({"type": userType}).toArray();
			res.json(result);
		});
//------------------- Employer part end  here -------------------//


        // --------------------- Payment -----------------------//
        app.post('/create-payment-intent',async(req,res)=>{
            const jobManage = req.body;
            const price = jobManage.price;
            const ammount = price * 100;
            const paymentIntent  = await stripe.paymentIntents.create({
                currency: 'usd',
                ammount:ammount,
                'payment_method_types':[
                    'card'
                ]
            })
            res.send({
                clientSecret: paymentIntent.client_secret,
            })
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
