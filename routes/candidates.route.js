const router = require('express').Router();
const { getAllCandidate, getCandidateById, updateCandidateProfile, applyToJob } = require('../controllers/candidates.controller');

// get all candidates
router.get("/candidate", getAllCandidate);

// get candidate by id
router.get("/candidate/:id", getCandidateById);

// Candidate Profile Update
router.put("/candidate", updateCandidateProfile);

// ------apply job section ---------\\
router.post('/candidate/applyjobs', applyToJob);

module.exports = router;
