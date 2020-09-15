const express = require('express');
const router = express.Router();
const postDao = require('../models/Post');
const categoryDao = require('../models/Category');

/* Show All Posts. */
router.get('/', async (req, res, next) => {
  const postsWithUser = await postDao.find();
  res.render('posts/list', {
    postsWithUser: postsWithUser,
    category: undefined
  });
});

/* Create Post. */
router.post('/',
  (req, res, next) => {
    if (!req.body.title) {
      req.flash('inputDatas', req.body);
      req.flash('inputErrors', { title: 'Title is required.' });
      return res.redirect('/posts/new');
    }
    if (req.body.category_id === 'none') {
      req.flash('inputDatas', req.body);
      req.flash('inputErrors', { category: 'Please select a valid category.' });
      return res.redirect('/posts/new');
    }
    next();
  },
  (req, res, next) => {
    req.body.user_id = req.user[0].id;
    next();
  },
  async (req, res, next) => {
    const postId = await postDao.create(req.body);
    res.redirect(`/posts/${postId}`);
  }
);

/* Create Post Form. */
router.get('/new', (req, res, next) => {
  res.render('posts/new', {
    inputDatas: req.flash('inputDatas')[0],
    inputErrors: req.flash('inputErrors')[0]
  });
})

router.get('/category/:categoryId', async (req, res, next) => {
  const postsWithUser = await postDao.find(req.params.categoryId);
  res.render('posts/list', {
    postsWithUser: postsWithUser,
    category: res.locals.categories.find( category => category.id == req.params.categoryId )
  });
})

/* Edit Post. */
router.put('/:postId',
  (req, res, next) => {
    if (!req.body.title) {
      req.flash('inputDatas', req.body);
      req.flash('inputErrors', { title: 'Title is required.' });
      return res.redirect(`/posts/${req.params.postId}/edit`);
    }
    next();
  },
  async (req, res, next) => {
    await postDao.modify(req.params.postId, req.body);
    res.redirect(`/posts/${req.params.postId}`);
  }
)

/* Edit Post Form. */
router.get('/:postId/edit', async (req, res, next) => {
  const postsWithUser = await postDao.read(req.params.postId);
  res.render('posts/edit', {
    postWithUser: postsWithUser[0],
    inputDatas: req.flash('inputDatas')[0],
    inputErrors: req.flash('inputErrors')[0]
  });
})

/* Delete Post. */
router.delete('/:postId', async (req, res, next) => {
  await postDao.destroy(req.params.postId);
  res.redirect(`/posts/`);
})

/* Show Post Content. */
router.get('/:postId', async (req, res, next) => {
  const postsWithUser = await postDao.read(req.params.postId);
  res.render('posts/show', { postWithUser: postsWithUser[0] });
})

module.exports = router;
