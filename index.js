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

app.get('/', (_, res) => {
	res.sendStatus(200);
});

app.listen(port,()=>{
    console.log('server running on:', port)
})
