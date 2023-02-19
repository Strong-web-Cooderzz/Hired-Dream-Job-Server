const router = require('express').Router();
const { getAllCandidate, getCandidateById, updateCandidateProfile, applyToJob, getAppliedCandidateByEmail } = require('../controllers/candidates.controller');
const verifyJWT = require('../middlewares/verifyJWT');

// get all candidates
router.get("/candidate", getAllCandidate);

// get candidate by id
router.get("/candidate/:id", getCandidateById);

// Candidate Profile Update
router.put("/candidate", verifyJWT, updateCandidateProfile);

// ------apply job section ---------\\
router.post('/candidate/applyjobs', verifyJWT, applyToJob);

// find all applied candidates who is applied for my 
router.get('/get_applied_candidate/:email', getAppliedCandidateByEmail)

module.exports = router;
