const { jobsCollection, applyJobCollection, featuredJobCollection, ObjectId } = require('../models/mongodb.model');

exports.getAllJobs = async (req, res) => {
	const limit = Number(req.query.limit);
	if (limit) {
		const result = await jobsCollection.find({}).limit(limit).toArray();
		res.send(result)
	} else {
		const result = await jobsCollection.find({}).toArray();
		res.send(result)
	}
};

exports.jobCounter = async (_, res) => {
	const result= await jobsCollection.countDocuments();
	res.send(result.toString());
}

exports.getFeaturedJobs = async (req, res) => {
	const result = await featuredJobCollection.find({}).limit(6).toArray();
	res.send(result);
};

exports.myAppliedJobs = async (req, res) => {
	const id = req.params.id;
	const query = { candidateId: id };
	const appliedJobPost = await applyJobCollection.find(query).toArray();
	res.send(appliedJobPost);
};

exports.getJobByEmail = async (req, res) => {
	const email = req.query.email;
	const filter = { jobEmail: email }
	const result = await jobsCollection.find(filter).toArray();
	res.send(result)
};

exports.getJobsById = async (req, res) => {
	const id = req.params.id;
	const query = { _id: ObjectId(id) };
	const result = await jobsCollection.findOne(query);
	res.send(result);
};

exports.postJob = async (req, res) => {
	const jobBody = req.body;
	const date = new Date();
	jobBody.postTime = date;
	const result = await jobsCollection.insertOne(jobBody);
	res.send(result);
};

exports.updateJob = async (req, res) => {
	const id = req.params.id;
	const body = req.body;
	const filter = { _id: ObjectId(id) };
	const option = { upsert: true };
	const updateJob = {
		$set: body,
	};
	const result = await jobsCollection.updateOne(filter, updateJob, option);
	res.send(result);
};

exports.updateJobVisibility = async (req, res) => {
	const id = req.params.id;
	const body = req.body.isVisible;
	const filter = { _id: ObjectId(id) };
	const option = { upsert: true };
	const updateJob = {
		$set: { isVisible: body },
	};
	const result = await jobsCollection.updateOne(filter, updateJob, option);
	res.send(result);
};

exports.deleteJob = async (req, res) => {
	const id = req.params.id;
	const filter = { _id: ObjectId(id) }
	const result = await jobsCollection.deleteOne(filter)
	res.send(result)
};

exports.searchJobs = async (req, res) => {
	const query = req.query;
	const search = req.query.search;
	const location = req.query.location;
	let jobType;
	if (query.type) {
		if (query.type === 'all') {
			jobType = new RegExp(`.*`, 'gi');
		} else {
			jobType = req.query.type;
		}
	} else {
		// selects everything using regex;
		jobType = new RegExp(`.*`, 'gi');
	}
	// checks if search and location exists using regex
	const searchRe = new RegExp(`.*${search}.*`, 'gi');
	const desRe = new RegExp(`.*${search}.*`, 'gi');
	const companyRe = new RegExp(`.*${search}.*`, 'gi');
	const locationRe = new RegExp(`.*${location}.*`, 'gi');
	let newest;
	if (query.sort === 'new' || query.sort == '') {
		// -1 returns desecndeing
		newest = -1;
	} else {
		newest = 1;
	}

	// requires to use UNIX timestamp
	const second = 1000;
	const minute = 60 * second;
	const hour = 60 * minute;
	const day = 24 * hour;
	const now = new Date().getTime();
	const datePosted = parseInt(query.time);
	let time;
	if (datePosted === 0) {
		time = 0;
	} else if (datePosted === hour) {
		time = now - hour;
	} else if (datePosted === day) {
		time = now - day;
	} else if (datePosted === 7 * day) {
		time = now - (7 * day);
	} else if (datePosted === 14 * day) {
		time = now - (14 * day);
	} else if (datePosted === 30 * day) {
		time = now - (30 * day);
	} else {
		time = 0;
	}
	const perPage = Number(query["per-page"]);
	const pageNumber = parseInt(query.page);
	let category = query.category;
	if (category === '') {
		category = new RegExp(`.*`, 'gi');
	}
	const result = await jobsCollection.find({
		$or: [{"title": searchRe}, {"jobDescription": desRe}, {"company": companyRe}],
		"location": locationRe,
		"jobType": jobType,
		"postTime": { "$gte": new Date(time) },
		"isVisible": true,
		category
	}).sort({
		"postTime": newest
	}).limit(perPage).skip((pageNumber - 1) * perPage).toArray();
	res.send(result);
};