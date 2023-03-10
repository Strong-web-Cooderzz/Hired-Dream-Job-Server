const express = require('express');
const router = express.Router();

const { getAllJobs, getJobByEmail, getJobsById, postJob, updateJob, deleteJob, searchJobs, updateJobVisibility, myAppliedJobs, getFeaturedJobs, jobCounter, jobCounterByCategory, PostFeaturedJobs, featuredJob, deleteFeaturedJob,jobCounterByCities, getAllJobsByType, deleteJobByAdmin, setMeeting, getMeetings, employerMeetings } = require('../controllers/jobs.controller');
const verifyJWT = require('../middlewares/verifyJWT');

// get all jobs by type
router.get('/jobs', getAllJobsByType)

// get all jobs
router.get('/jobs', getAllJobs)

router.get('/job-counter', jobCounter)

router.get('/job-counter-by-category', jobCounterByCategory)

router.get('/job-counter-by-cities', jobCounterByCities)

// find job by email
router.get('/jobsFindByEmail', getJobByEmail)

// find Job by id
router.get("/jobs/:id", getJobsById);

// Post job
router.post("/jobs", verifyJWT, postJob);

// Job Visibility Update
router.patch("/jobs/:id", updateJobVisibility);

// Featured Job
router.get("/featured", getFeaturedJobs);

// Featured Job Filter by Id
router.get("/featured/:id", featuredJob);

// Delete Featured Job
router.delete('/featured/:id', deleteFeaturedJob);

// Post Featured Job
router.post("/featured", PostFeaturedJobs);

// Update job
router.patch("/jobsUpdate/:id", updateJob);

// Delete job
router.delete('/deleteJob/:id', deleteJob);

// search for jobs
router.get('/find-jobs', searchJobs);

// admin can delete job
router.delete('/delete-job', verifyJWT, deleteJobByAdmin)

// my all job applied post
router.get("/job-applied-post/:id", myAppliedJobs);

router.post("/add-meeting", verifyJWT, setMeeting)

router.get('/get-meetings', verifyJWT, getMeetings)

module.exports = router;
