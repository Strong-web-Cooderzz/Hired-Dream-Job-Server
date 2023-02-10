const { postsCollection, ObjectId, commentsCollection } = require('../models/mongodb.model');

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
