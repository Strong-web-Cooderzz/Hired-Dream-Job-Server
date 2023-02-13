const { postsCollection, ObjectId, commentsCollection, usersCollection } = require('../models/mongodb.model');

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
	const result = await postsCollection.aggregate([
		{
			$match: {
				_id: ObjectId(id)
			}
		},
		{
			$lookup: {
				from: "users",
				localField: "author",
				foreignField: "_id",
				as: "author"
			}
		},
		{
			$unwind: "$author"
		},
		{
			$lookup: {
				from: "comments",
				localField: "_id",
				foreignField: "postId",
				as: "comments",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "userId",
							foreignField: "_id",
							as: "user"
						}
					},
					{
						$sort: { "_id": -1 }
					},
					{
						$unwind: "$user"
					}
				]
			}
		}
	]).toArray();
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
	const filter = { email: email }
	const result = await postsCollection.find(filter).toArray();
	res.send(result);
};

exports.deletePost = async (req, res) => {
	const id = req.params.id
	console.log(id)
	const filter = { _id: ObjectId(id) }
	const result = await postsCollection.deleteOne(filter);
	res.send(result);
};

exports.postComment = async (req, res) => {
	const comment = req.body;
	if (comment.userId && comment.postId && comment.comment) {
		const newComment = { userId: ObjectId(comment.userId), postId: ObjectId(comment.postId), comment: comment.comment }
		const result = await commentsCollection.insertOne(newComment);
		res.send(result)
	} else {
		return
	}
}

exports.deleteComment = (req, res) => {
	usersCollection.aggregate([
		{
			$match: {
				'email': req.decoded
			}
		},
		{
			$lookup: {
				from: 'comments',
				localField: '_id',
				foreignField: 'userId',
				as: 'comment',
				pipeline: [
					{
						$match: { '_id': ObjectId(req.query.commentId) }
					},
					{
						$unwind: '$comment'
					}
				]
			},
		},
	]).forEach(async i => {
		const result = await commentsCollection.deleteOne({ _id: ObjectId(i.comment[0]?._id) })
		res.send(result)
	});
}
