const express = require('express');
const router = express.Router();
const post = require('../models/post');

/* Show All Posts. */
router.get('/', async (req, res, next) => {
  const posts = await post.find();
  res.render('posts/list', { posts: posts });
});

/* Create Post. */
router.post('/', async (req, res, next) => {
  const postId = await post.create(req.body);
  res.redirect(`/posts/${postId}`);
});

/* Create Post Form. */
router.get('/new', (req, res, next) => {
  res.render('posts/new', { });
})

/* Show Post Content. */
router.get('/:postId', async (req, res, next) => {
  const posts = await post.read(req.params.postId);
  res.render('posts/read', { post: posts[0] });
})

module.exports = router;
