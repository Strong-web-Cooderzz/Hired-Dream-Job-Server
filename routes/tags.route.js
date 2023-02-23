const router = require('express').Router();
const { blogTags } = require('../controllers/blogTags.controller');


// get all categories
router.get("/tags", blogTags);

// // get candidate by id
// router.get("/candidate/:id", getCandidateById);

// // Candidate Profile Update
// router.put("/candidate", updateCandidateProfile);

// // ------apply job section ---------\\
// router.post('/candidate/applyjobs', applyToJob);

module.exports = router;
