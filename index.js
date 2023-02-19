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
				console.log(payload.uid)
				global.socketClients.push({ uid: payload.uid, socketId: socket.id });
				next();
			})
			.catch(() => {
				io.disconnect();
			});
	}
});

io.on("connection", (socket) => {
	console.log("A new connection");
});

server.listen(port, () => {
	console.log("server running on:", port);
});
