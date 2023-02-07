
const { postsCollection, ObjectId } = require('../models/mongodb.model');

exports.blogPosts = async (req, res) => {
	const result = await postsCollection.find({}).toArray();
	res.send(result);
};

exports.postBlog = async (req, res) => {
    const post = req.body
	const result = await postsCollection.insertOne(post);
	res.send(result);
};

exports.blogPost = async (req, res) => {
    const id = req.params.id
    const filter = {_id: ObjectId(id)}
	const result = await postsCollection.findOne(filter);
	res.send(result);
};

// Update Blog post
exports.editPost = async (req, res) => {
	const id = req.params.id;
	const updateData = req.body;
	const filter = { _id: ObjectId(id) };
	const option = { upsert: true };
	const userData = {
		$set: updateData,
	};
	const result = await postsCollection.updateOne(filter, userData, option);
	res.send(result);
};

exports.blogUserEmail = async (req, res) => {
    const email = req.query.email
    const filter = {email: email}
	const result = await postsCollection.find(filter).toArray();
	res.send(result);
};

exports.deletePost = async (req, res) => {
    const id = req.params.id
	console.log(id)
    const filter = {_id: ObjectId(id)}
	const result = await postsCollection.deleteOne(filter);
	res.send(result);
};