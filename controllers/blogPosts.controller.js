const { postsCollection, ObjectId } = require('../models/mongodb.model');

exports.blogPosts = async (req, res) => {
	const result = await postsCollection.find({}).toArray();
	res.send(result);
};

exports.postBlog = async (req, res) => {
	const post = req.body;
	post.date = new Date();
	const result = await postsCollection.insertOne(post);
	res.send(result);
};

exports.blogPost = async (req, res) => {
	const id = req.params.id
	const filter = { _id: ObjectId(id) }
	const result = await postsCollection.findOne(filter);
	res.send(result);
};
