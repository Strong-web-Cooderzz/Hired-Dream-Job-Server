const router = require('express').Router();
const { getUserByEmail, insertUser, updateUser, getUserByType } = require('../controllers/users.controller');

// get user by email
router.get("/user", getUserByEmail);

// sends all user to admin dashboard
router.get('/api/v1/get/users/', getUserByType);

// insert user to database
router.post("/user", insertUser);

// update user
router.put("/user/:id", updateUser);

module.exports = router;