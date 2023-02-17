const { usersCollection, applyJobCollection, ObjectId } = require('../models/mongodb.model');

exports.getAllCandidate = async (req, res) => {
	const returnRegex = value => {
		return new RegExp(`.*${value}.*`, 'gi')
	}

	let candidate = req.query.candidate;
	let location = req.query.location;
	let locationArray = []

	if (candidate) {
		candidate = returnRegex(candidate)
	} else {
		candidate = new RegExp('.*', 'gi')
	}

	if (location) {
		location = returnRegex(location)
		locationArray = [{'address.city': location}, {'address.country': location}]
	} else {
		location = new RegExp('.*', 'gi')
		locationArray = [{'address': {$exists: true}}, {'address': {$exists: false}}]
	}

	const result = await usersCollection.aggregate([
		{
			$match: {
				fullName: candidate,
				type: 'Candidate',
				$or: locationArray
			}
		}
	]).toArray();
	res.send(result);
};

exports.getCandidateById = async (req, res) => {
	const id = req.params.id;
	const query = { _id: ObjectId(id) };
	const result = await usersCollection.findOne(query);
	res.send(result);
};

exports.updateCandidateProfile = async (req, res) => {
	const userId = ObjectId(req.decoded)
	const updateData = req.body;
	const filter = { _id: userId };
	const option = { upsert: true };
	const userData = {
		$set: updateData,
	};
	const result = await usersCollection.updateOne(filter, userData, option);
	res.send(result);
};

exports.applyToJob = async (req, res) => {
	const jobReq = req.body;
	jobReq.applyDate = new Date();
	jobReq.candidateId = ObjectId(req.decoded)
	jobReq.companyId = ObjectId(jobReq.companyId)
	jobReq.applyDate = new Date();
	const saveJobApply = await applyJobCollection.insertOne(jobReq);
	res.send(saveJobApply)
};

exports.getAppliedCandidateByEmail = async (req, res) => {
	const email = req.params.email;
	const query = { companyEmail: email }
	const appliedCandidate = await applyJobCollection.find(query).toArray()
	res.send(appliedCandidate)
}
