const { usersCollection, applyJobCollection, ObjectId } = require('../models/mongodb.model');

exports.getAllCandidate = async (req, res) => {
	const returnRegex = value => {
		return new RegExp(`.*${value}.*`, 'gi')
	}

	const candidateType = req.query.type;
	const candidate = req.query.candidate;
	const location = req.query.location;

	const query = { type: candidateType, fullName: candidate };

	if (!candidate) {
		query.fullName = { $exists: true }
	} else {
		query.fullName = returnRegex(candidate)
	}
	// if (!location) {
	// 	query.address = { $exists: true }
	// } else {
	// 	query.address = returnRegex(location)
	// }

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
	const saveJobApply = await applyJobCollection.insertOne(jobReq);
	res.send(saveJobApply)
};

exports.getAppliedCandidateByEmail = async (req, res) => {
	const email = req.params.email;
	const query = { companyEmail: email }
	const appliedCandidate = await applyJobCollection.find(query).toArray()
	res.send(appliedCandidate)
}
