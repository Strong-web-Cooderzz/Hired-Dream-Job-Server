const router = require('express').Router();
const { blogPosts, postBlog, blogPost, postComment } = require('../controllers/blogPosts.controller');


// get all categories
router.get("/blogPosts", blogPosts);

// get candidate by id
router.get("/blogPost/:id", blogPost);

// // Candidate Profile Update
// router.put("/candidate", updateCandidateProfile);

// ------apply job section ---------\\
router.post('/postBlog', postBlog);

// post comment on blog post
router.post('/post-comment', postComment)

module.exports = router;
