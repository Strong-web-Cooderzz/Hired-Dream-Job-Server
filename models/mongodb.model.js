const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require('stripe')(process.env.STRIPE_SECRET);

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
const categoriesCollection = client.db("hired-job").collection("blogCategories");
const tagsCollection = client.db("hired-job").collection("blogTags");
const postsCollection = client.db("hired-job").collection("blogPosts");
const commentsCollection = client.db('hired-job').collection('comments')

module.exports = { jobsCollection, ObjectId, categoriesCollection, tagsCollection, usersCollection, applyJobCollection, postsCollection, featuredJobCollection, commentsCollection ,stripe};
