const { usersCollection, ObjectId } = require('../models/mongodb.model');

exports.getEmployersByType = async (req, res) => {
	const result = await usersCollection.aggregate([
		{
			$match: {
				type: 'Agency'
			}
		},
		{
			$lookup: {
				from: 'jobs',
				localField: '_id',
				foreignField: 'companyId',
				as: 'jobs'
			}
		},
		{
			$addFields: {
				jobsCount: {$size: '$jobs'}
			}
		},
		{
			$unset: 'jobs'
		}
	]).toArray()
	res.send(result);
};

exports.getEmployerById = async (req, res) => {
	const id = req.params.id;
	const result = await usersCollection.aggregate([
		{
			$match: {
				_id: ObjectId(id)
			}
		},
		{
			$lookup: {
				from: 'jobs',
				localField: '_id',
				foreignField: 'companyId',
				as: 'jobs'
			}
		}
	]).toArray();
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
		.find({ fullName: searchRe, type: 'Agency' })
		.toArray();
	res.send(result);
}
