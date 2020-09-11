var express = require('express');
var router = express.Router();
const post = require('../models/post');

/* Home Page. */
router.get('/', async (req, res, next) => {
  const posts = await post.find();
  res.render('home/index', { posts: posts });
});

/* Log In Form. */
router.get('/login', (req, res, next) => {
  res.render('home/login', { });
});

module.exports = router;
