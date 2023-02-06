const { tagsCollection } = require('../models/mongodb.model');

exports.blogTags = async (req, res) => {
	const result = await tagsCollection.find({}).toArray();
	res.send(result);
};