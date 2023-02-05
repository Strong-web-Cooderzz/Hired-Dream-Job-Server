const { usersCollection, ObjectId } = require('../models/mongodb.model');

exports.getUserByEmail = async (req, res) => {
	const email = req.query.email;
	const query = { email: email };
	const result = await usersCollection.findOne(query);
	res.send(result);
};

exports.insertUser = async (req, res) => {
	const userData = req.body;
	const result = await usersCollection.insertOne(userData);
	res.send(result);
};

exports.getUserByType = async (req, res) => {
	let userType = req.query.type;
	if (userType === 'candidates') {
		userType = 'Candidate';
	} else if (userType === 'employers') {
		userType = 'Agency';
	} else {
		userType = '';
	}
	const result = await usersCollection.find({ "type": userType }).toArray();
	res.json(result);
};

exports.updateUser = async (req, res) => {
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
};
