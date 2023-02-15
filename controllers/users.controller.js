const { getAuth } = require('firebase-admin/auth');
const { adminApp } = require('../middlewares/verifyJWT');
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
	const id = req.decoded;
	const userData = req.body;
	// user can not change their email
	delete userData['email']
	userData.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	// userData.ip = '0.0.0.0';
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
	if (result.acknowledged) {
		getAuth(adminApp)
			.updateUser(id, {
				displayName: userData.fullName,
				phoneNumber: userData.phoneNumber,
				photoURL: userData.photo
			})
			.then(userRecord => {
				res.send(result);
			})
			.catch(err => console.log(err))
	}
};

exports.registerUser = async (req, res) => {
	const email = req.body.email;
	const name = req.body.fullName;
	const photo = req.body.photo;
	const type = req.body.type;
	const password = req.body.password;
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	const user = {};

	// checks if user exists with same email or not
	usersCollection.findOne({ email })
		.then(response => {
			if (response) {
				res.json({ msg: 'account-exists' })
			} else {
				// making sure every email is unique
				usersCollection.createIndex({ 'email': 1 }, { unique: true })
					.then(async _ => {
						// inserting new document
						const result = await usersCollection.insertOne({
							email,
							fullName: name,
							photo,
							type,
							ip
						});
						if (result.acknowledged) {
							console.log(result)
							user.email = email;
							user.fullName = name;
							user.photo = photo;
							user.type = type;
							user._id = result.insertedId;
							// creating account in firebase
							getAuth(adminApp)
								.createUser({
									uid: result.insertedId.toString(),
									email,
									emailVerified: false,
									password,
									displayName: name,
									photoURL: photo
								})
								.then(userRecord => {
									console.log(userRecord);
									getAuth(adminApp)
										.createCustomToken(result.insertedId.toString())
										.then(customToken => {
											user.token = customToken;
											res.send(user)
										})
										.catch(err => console.log(err))
								})
								.catch(err => console.log(err))
						}
					});
			}
		})
}

exports.login = async (req, res) => {
	const user = req.decoded
	const result = await usersCollection.findOne({ _id: ObjectId(user) })
	res.send(result)
}
