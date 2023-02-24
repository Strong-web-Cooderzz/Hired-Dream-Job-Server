const { usersCollection, applyJobCollection, ObjectId, notificationsCollection } = require('../models/mongodb.model');

exports.getAllCandidate = async (req, res) => {
	const returnRegex = value => {
		return new RegExp(`.*${value}.*`, 'gi')
	}

	let candidate = req.query.candidate;
	let location = req.query.location;
	let segment = req.query.segment;
	let andArray = []

	if (candidate) {
		candidate = returnRegex(candidate)
	} else {
		candidate = new RegExp('.*', 'gi')
	}

	if (location && segment) {
		location = returnRegex(location)
		segment = returnRegex(segment)
		andArray = [{ $or: [{ 'address.city': location }, { 'address.country': location }] }, { 'segment': segment }]
	} else if (location) {
		location = returnRegex(location)
		andArray = [{ $or: [{ 'address.city': location }, { 'address.country': location }] }]
	} else if (segment) {
		segment = returnRegex(segment)
		andArray = [{ 'segment': segment }]
	} else if (!location) {
		andArray = [{ $or: [{ 'address': { $exists: true } }, { 'address': { $exists: false } }] }]
	}

	const result = await usersCollection.aggregate([
		{
			$match: {
				fullName: candidate,
				type: 'Candidate',
				$and: andArray
				// $or: segmentArray,
				// $or: locationArray
			}
		}
	]).toArray();
	res.send(result);
};

exports.getCandidateById = async (req, res) => {
	const id = req.params.id;
	const query = { _id: ObjectId(id) };
	const result = await usersCollection.aggregate([
		{
			$match: {
				_id: ObjectId(id)
			}
		},
		{
			$unset: 'ip'
		}
	]).toArray();
	result.map(singleResult => res.send(singleResult));
	// res.send(result);
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
	const jobReq = { ...req.body };
	jobReq.candidateId = ObjectId(req.decoded)
	jobReq.companyId = ObjectId(jobReq.companyId)
	jobReq.applyDate = new Date();
	// console.log(socketClients)
	// const specificClients = socketClients.filter(client => req.body.companyId === client.uid)
	const userInfo = socketClients.filter(client => req.decoded === client.uid)
	io.to(req.body.companyId).emit('notification', `${userInfo[0]?.userName || 'Someone'} applied to your job ${jobReq.jobTitle}`)
	// specificClients.map(client => {
	// 	// console.log(client)
	// 	io.to(client.socketId).emit('notification', `${userInfo[0].userName} applied to your job ${jobReq.jobTitle}`)
	// })
	const saveJobApply = await applyJobCollection.insertOne(jobReq);
	await notificationsCollection.insertOne({
		userId: jobReq.companyId,
		notification: `${userInfo[0]?.userName || 'Someone'} applied to your job ${jobReq.jobTitle}`
	})
	res.send(saveJobApply)
};

exports.getAppliedCandidateByEmail = async (req, res) => {
	const id = req.params.email;
	const query = { companyId:ObjectId(id)}
	const appliedCandidate = await applyJobCollection.aggregate([
		{
			$match: query
		},
		{
			$lookup: {
				from: 'users',
				localField: 'candidateId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{
			$unwind: '$user'
		}
	]).toArray()
	res.send(appliedCandidate)
}
