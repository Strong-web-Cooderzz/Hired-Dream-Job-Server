const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

// importing routes
const candidatesRouter = require('./routes/candidates.route');
const employersRouter = require('./routes/employers.route');
const jobsRouter = require('./routes/jobs.route');
const paymentsRouter = require('./routes/payments.route');
const usersRouter = require('./routes/users.route');
const categoryRouter = require('./routes/blogCategory.route');
const tagsRouter = require('./routes/tags.route');
const postRoute = require('./routes/blogPosts.route');
const stripeRoute = require('./routes/stripe.route');
// const sslPay = require('./routes/sslPay.route');

// middleware
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

app.get('/', (_, res) => {
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	res.send('Your ip address is' + ip);
});

app.listen(port, () => {
	console.log('server running on:', port)
})
