const { categoriesCollection } = require('../models/mongodb.model');

exports.blogCategories = async (req, res) => {
	const result = await categoriesCollection.find({}).toArray();
	res.send(result);
};