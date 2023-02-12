const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('../serviceAccountKey.json');

const adminApp = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

function verifyJWT(req, res, next) {
	const token = req.headers.authorization.split(' ')[1];
	getAuth(adminApp)
	.verifyIdToken(token, true)
	.then(payload => {
			// console.log(payload)
			req.decoded = payload.email;
			next();
		})
	.catch(err => {
			if(err.code === 'auth/id-token-revoked'){
				res.status(401);
			} else {
				res.status(401).json(err.code);
			}
		})
}

module.exports = verifyJWT;
