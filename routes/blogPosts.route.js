const router = require('express').Router();
const { blogPosts, postBlog, blogPost, blogUserEmail, deletePost, editPost, postComment, deleteComment, postLike } = require('../controllers/blogPosts.controller');
const verifyJWT = require('../middlewares/verifyJWT');

// get all blogs
router.get("/blogPosts", blogPosts);

// get blog by id
router.get("/blogPost/:id", blogPost);

// Get blog post by email
router.get("/blogPost/", blogUserEmail);

// blog Profile Update
router.patch("/editPost/:id", editPost);

// post new blog
router.post('/postBlog', verifyJWT, postBlog);

// ------delete blog ---------\\
router.delete('/deletePost/:id', deletePost);

// post comment on blog post
router.post('/post-comment', verifyJWT, postComment)

// add like to blog post
router.post('/post-like', verifyJWT, postLike)

router.delete('/delete-comment', verifyJWT, deleteComment)

module.exports = router;
