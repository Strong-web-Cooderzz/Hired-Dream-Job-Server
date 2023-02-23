const { jobsCollection, applyJobCollection, featuredJobCollection, ObjectId, usersCollection } = require('../models/mongodb.model');

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

exports.getAllJobsByType = async (req, res) => {
	const type = req.query.type==='true';
	const filter = {isVisible: type}
	const result = await jobsCollection.find(filter).toArray();
	res.send(result);
}


exports.jobCounter = async (_, res) => {
	const result = await jobsCollection.countDocuments();
	res.send(result.toString());
}

exports.jobCounterByCategory = async (_, res) => {
	const result = await jobsCollection.aggregate([
		{
			$match: { isVisible: true }
		},
		{
			$group: {
				_id: "$category",
				count: { $sum: 1 }
			}
		},
	]).toArray();
	res.send(result)
}



exports.jobCounterByCities = async (_, res) => {
	const result = await jobsCollection.aggregate([
		{
			$group: {
				_id: "$category",
				count: { $sum: 1 }
			}
		}
	]).toArray();
	res.send(result)
}

// Get featured Job
exports.getFeaturedJobs = async (req, res) => {
	const result = await featuredJobCollection.aggregate([
		
		{
			$lookup: {
				from: 'jobs',
				localField: 'jobId',
				foreignField: '_id',
				as: 'job'
			}
		},
		{
			$unwind: '$job'
		}
	]).toArray()
	console.log(result)
	res.send(result);
};

// Get featured Job By Id

exports.featuredJob = async (req, res) => {
	const id = req.params.id
	const result = await featuredJobCollection.aggregate([
		{
			$match: {
				_id: ObjectId(id)
			}
		},
		{
			$lookup: {
				from: 'featuredJob',
				localField: 'jobId',
				foreignField: '_id',
				as: 'job'
			}
		}
	]).toArray()
	console.log(result)
	res.send(result);
};

// Delete featured Job By Id

exports.deleteFeaturedJob = async (req, res) => {
	const id = req.params.id
	const result = await featuredJobCollection.deleteOne({ _id: id })
	res.send(result);
};

// Post Featured Job
exports.PostFeaturedJobs = async (req, res) => {
	const featured = req.body;
	const jobId = {jobId:ObjectId(req.body.jobId)}
	console.log(jobId)
	const result = await featuredJobCollection.insertOne(jobId);
	res.send(result);
};

exports.myAppliedJobs = async (req, res) => {
	const id = req.params.id;
	const query = { companyId: ObjectId(id) };
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
	const result = await jobsCollection.aggregate([
		{
			$match: { _id: ObjectId(id) }
		},
		{
			$lookup: {
				from: 'users',
				localField: 'companyId',
				foreignField: '_id',
				as: 'company'
			}
		},
		{
			$unwind: '$company'
		}
	]).toArray();
	res.send(result);
};

exports.postJob = async (req, res) => {
	const jobBody = req.body;
	const date = new Date();
	const companyId = ObjectId(req.decoded)
	jobBody.postTime = date;
	jobBody.companyId = companyId;
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
	const category = req.query.category;
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
	const categoryRe = new RegExp(`.*${category}.*`, 'gi')
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
	const result = {};
	// result.data = await jobsCollection.find({
	// 	$or: [{ "title": searchRe }, { "jobDescription": desRe }, { "company": companyRe }],
	// 	"location": locationRe,
	// 	"jobType": jobType,
	// 	"postTime": { "$gte": new Date(time) },
	// 	"isVisible": true,
	// 	category: categoryRe
	// }).sort({
	// 	"postTime": newest
	// }).limit(perPage).skip((pageNumber - 1) * perPage).toArray();
	const skip = Number((pageNumber - 1) * perPage);
	result.data = await jobsCollection.aggregate([
		{
			$match: {
				$or: [{ title: searchRe }, { jobDescription: desRe }, { company: companyRe }],
				location: locationRe,
				"jobType": jobType,
				"postTime": { "$gte": new Date(time) },
				"isVisible": true,
				category: categoryRe
			}
		},
		{
			$sort: { postTime: newest }
		},
		{
			$skip: skip
		},
		{
			$limit: perPage
		},
		{
			$lookup: {
				from: 'users',
				localField: 'companyId',
				foreignField: '_id',
				as: 'company'
			}
		},
	]).toArray();
	result.count = await jobsCollection.countDocuments({
		$or: [{ "title": searchRe }, { "jobDescription": desRe }, { "company": companyRe }],
		"location": locationRe,
		"jobType": jobType,
		"postTime": { "$gte": new Date(time) },
		"isVisible": true,
		category: categoryRe
	})
	res.send(result);
};
