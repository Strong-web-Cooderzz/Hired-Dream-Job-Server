const router = require('express').Router();
const { blogCategories } = require('../controllers/blogCategory.controller');


// get all categories
router.get("/categories", blogCategories);

// // get candidate by id
// router.get("/candidate/:id", getCandidateById);

// // Candidate Profile Update
// router.put("/candidate", updateCandidateProfile);

// // ------apply job section ---------\\
// router.post('/candidate/applyjobs', applyToJob);

module.exports = router;
