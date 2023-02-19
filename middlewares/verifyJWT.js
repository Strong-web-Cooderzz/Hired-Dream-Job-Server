const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
// const serviceAccount = require('../serviceAccountKey.json');

const adminApp = admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT))
});

function verifyJWT(req, res, next) {
	const headerToken = req.headers.authorization;
	if (headerToken) {
		const token = req.headers.authorization.split(' ')[1];
		getAuth(adminApp)
			.verifyIdToken(token, true)
			.then(payload => {
				req.decoded = payload.uid;
				next();
			})
			.catch(err => {
				if (err.code === 'auth/id-token-revoked') {
					res.status(401).json(err.code);
				} else {
					res.status(401).json(err.code);
				}
			})
	} else {
		res.status(401)
	}
}

module.exports = { adminApp }

module.exports = verifyJWT;
