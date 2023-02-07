const { usersCollection, ObjectId } = require('../models/mongodb.model');

exports.getEmployersByType = async (req, res) => {
	const employ = req.query.type;
	const query = { type: employ };
	const result = await usersCollection.find(query).toArray();
	res.send(result);
};

exports.getEmployerById = async (req, res) => {
	const id = req.params.id;
	const query = { _id: ObjectId(id) };
	const result = await usersCollection.findOne(query);
	res.send(result);
};

exports.updateEmployer = async (req, res) => {
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
};

exports.searchEmployers = async (req, res) => {
	const search = req.query.search;
	const location = req.query.location;
	const searchRe = new RegExp(`.*${search}.*`, "gi");
	const locationRe = new RegExp(`.*${location}.*`, "gi");
	const result = await usersCollection
		.find({ fullName: searchRe, address: locationRe })
		.toArray();
	res.send(result);
}
