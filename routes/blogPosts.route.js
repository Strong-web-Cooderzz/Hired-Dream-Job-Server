const router = require('express').Router();
const { blogPosts, postBlog, blogPost, blogUserEmail, deletePost, editPost } = require('../controllers/blogPosts.controller');


// get all blogs
router.get("/blogPosts", blogPosts);

// get blog by id
router.get("/blogPost/:id", blogPost);

// Get blog post by email
router.get("/blogPost/", blogUserEmail);

// blog Profile Update
router.patch("/editPost/:id", editPost);

// ------apply job section ---------\\
router.post('/postBlog', postBlog);

// ------delete blog ---------\\
router.delete('/deletePost/:id', deletePost);
// post comment on blog post
router.post('/post-comment', postComment)

module.exports = router;
