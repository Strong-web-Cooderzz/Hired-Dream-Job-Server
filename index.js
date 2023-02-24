const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
global.io = new Server(server, {
	cors: {
		origin: "*",
	},
});

require("dotenv").config();
const { getAuth } = require("firebase-admin/auth");
const { adminApp } = require("./middlewares/verifyJWT");
global.socketClients = [];

const port = process.env.PORT || 5000;

// importing routes
const candidatesRouter = require("./routes/candidates.route");
const employersRouter = require("./routes/employers.route");
const jobsRouter = require("./routes/jobs.route");
const paymentsRouter = require("./routes/payments.route");
const usersRouter = require("./routes/users.route");
const categoryRouter = require("./routes/blogCategory.route");
const tagsRouter = require("./routes/tags.route");
const postRoute = require("./routes/blogPosts.route");
const stripeRoute = require("./routes/stripe.route");
// const sslPay = require('./routes/sslPay.route');

// middleware
app.use((req, res, next) => {
	req.header("Access-Control-Allow-Origin", "*");
	next();
});
app.use(cors());
app.use(express.json());

// using route
app.use(candidatesRouter);
app.use(employersRouter);
app.use(jobsRouter);
app.use(paymentsRouter);
app.use(categoryRouter);
app.use(usersRouter);
app.use(tagsRouter);
app.use(postRoute);
app.use(stripeRoute);
// app.use(sslPay);

app.get("/", (req, res) => {
	const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
	res.send(`Your ip address is ${ip}`);
});

// this verifies connection
io.use((socket, next) => {
	const token = socket.handshake.auth.token;

	if (token) {
		getAuth(adminApp)
			.verifyIdToken(token, true)
			.then((payload) => {
				// console.log(payload)
				global.socketClients.push({ uid: payload.uid, userName: payload.name, socketId: socket.id });
				socket.join(payload.uid)
				// console.log(io.sockets.adapter.rooms[socket.id])
				next();
			})
			.catch(err => {
				console.log(err)
				socket.disconnect();
			});
	}
});

io.on("connection", (socket) => {
	console.log("A new connection");
	const rooms = socket.adapter.rooms
	// console.log('rooms', rooms)
	socket.on('disconnect', () => {
		console.log('someone disconnected')
		// console.log('disconnected rooms', rooms)
		// console.log(test)
		// for (let [i, j] of rooms) {
		// 	console.log(rooms, i, j, socket.id)
		// 	if (j.has(socket.id)) {
		// 		console.log(`someone disconnected`)
		// 		socket.leave(i)
		// 		console.log(`${socket.id} disconnected`)
		// 		console.log('rooms', rooms)
		// 	}
		// }

	})

	// console.log(io.sockets.adapter.ma)
	// socket.on('disconnect', () => {
	// 	// socketClients = socketClients.filter(client => socket.id !== client.socketId)
	// })
});
//
// io.on("disconnect", socket => {
// 	socket.leave()
// })

server.listen(port, () => {
	console.log("server running on:", port);
});
