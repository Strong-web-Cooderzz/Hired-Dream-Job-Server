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
				jobsCount: { $size: '$jobs' }
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
	const returnRegex = value => {
		return new RegExp(`.*${value}.*`, 'gi')
	}

	let search = req.query.search;
	let location = req.query.location;
	let segment = req.query.segment;
	let locationArray = [];

	if (search) {
		search = returnRegex(search)
	} else {
		search = new RegExp('.*', 'gi')
	}

	if (location) {
		locationArray = [{ 'address.city': returnRegex(location) }, { 'address.country': returnRegex(location) }, { 'address.postal': location }, { 'address.street': returnRegex(location) }]
	} else {
		console.log('here')
		locationArray = [{ 'address': {$exists: true} }, { 'address': {$exists: false} }]
	}

	const result = await usersCollection
		.aggregate([
			{
				$match: {
					fullName: search,
					type: 'Agency',
					$or: locationArray
				}
			}
		])
		.toArray();
	res.send(result);
}
