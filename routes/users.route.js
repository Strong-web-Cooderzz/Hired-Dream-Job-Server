const router = require('express').Router();
const { getUserByEmail, insertUser, updateUser, getUserByType, registerUser, login } = require('../controllers/users.controller');
const verifyJWT = require('../middlewares/verifyJWT');

// get user by email
router.get("/user", getUserByEmail);

// sends all user to admin dashboard
router.get('/api/v1/get/users/', getUserByType);

// register new user
router.post('/register', registerUser)

// get user info
router.get('/login', verifyJWT, login)

// insert user to database
router.post("/user", insertUser);

// update user
router.put("/user/:id", updateUser);

module.exports = router;
