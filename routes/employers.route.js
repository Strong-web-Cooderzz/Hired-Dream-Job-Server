const router = require('express').Router();
const { getEmployersByType, getEmployerById, updateEmployer, searchEmployers } = require('../controllers/employers.controller');

// get employers by type
router.get("/employ", getEmployersByType);

// get employer by id
router.get("/employ/:id", getEmployerById);

// update employer
router.put("/employ", updateEmployer);

// seacrch employers
router.get("/find-employer", searchEmployers);

module.exports = router;
