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
  res.render('posts/new', { title: 'Express' });
})

module.exports = router;
