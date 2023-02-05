const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = "mongodb+srv://DreamUser:7LKaa1qZ3Gh9BYS9@cluster0.b5doc61.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

//================= Database all collection part ====================//
const jobsCollection = client.db("hired-job").collection("jobs");
const usersCollection = client.db("hired-job").collection("users");
const applyJobCollection = client.db("hired-job").collection("applyjobs");
const featuredJobCollection = client.db("hired-job").collection("featuredJob");

module.exports = { jobsCollection, usersCollection, applyJobCollection, featuredJobCollection, ObjectId };
