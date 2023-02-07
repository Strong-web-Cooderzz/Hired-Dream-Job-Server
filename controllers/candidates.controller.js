
const { ObjectId } = require('mongodb');
const { usersCollection, applyJobCollection, ObjectId } = require('../models/mongodb.model');


exports.getAllCandidate = async (req, res) => {
	const candidate = req.query.type;
	const query = { type: candidate };
	const result = await usersCollection.find(query).toArray();
	res.send(result);
};

exports.getCandidateById = async (req, res) => {
	const id = req.params.id;
	const query = { _id: ObjectId(id) };
	const result = await usersCollection.findOne(query);
	res.send(result);
};

exports.updateCandidateProfile = async (req, res) => {
	const email = req.query.email;
	const updateData = req.body;
	const filter = { email: email };
	const option = { upsert: true };
	const userData = {
		$set: updateData,
	};
	const result = await usersCollection.updateOne(filter, userData, option);
	res.send(result);
};

exports.applyToJob = async (req, res) => {
	const jobReq = req.body;
	// converts base64 string to binary
	jobReq.candidateResume = Buffer.from(jobReq.candidateResume, 'base64');
	const saveJobApply = await applyJobCollection.insertOne(jobReq);
	res.send(saveJobApply)
};
