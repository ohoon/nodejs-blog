const express = require('express');
const router = express.Router();
const postDao = require('../models/Post');
const control = require('../utils/control');
const input = require('../utils/input');

/* Show All Posts. */
router.get('/', async (req, res, next) => {
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const count = await postDao.count(0, search);
  const maxPage = Math.ceil( count[0].postNum / limit );
  const postsWithUser = await postDao.find(0, page, limit, search);
  res.render('posts/list', {
    postsWithUser: postsWithUser,
    category: undefined,
    search: search,
    page: page,
    maxPage: maxPage,
  });
});

/* Create Post. */
router.post('/',
  control.isLoggedIn,
  input.checkCreatePost,
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
router.get('/new',
  control.isLoggedIn,
  (req, res, next) => {
    res.render('posts/new', {
      inputDatas: req.flash('inputDatas')[0],
      inputErrors: req.flash('inputErrors')[0]
    });
  }
);

/* Show Posts Filtered By Category */
router.get('/category/:categoryId', async (req, res, next) => {
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const count = await postDao.count(req.params.categoryId, search);
  const maxPage = Math.ceil( count[0].postNum / limit );
  const postsWithUser = await postDao.find(req.params.categoryId, page, limit, search);
  res.render('posts/list', {
    postsWithUser: postsWithUser,
    category: res.locals.categories.find( category => category.id == req.params.categoryId ),
    search: search,
    page: page,
    maxPage: maxPage,
  });
});

/* Edit Post. */
router.put('/:postId',
  control.isLoggedIn,
  control.checkAuthorPermission,
  input.checkEditPost,
  async (req, res, next) => {
    await postDao.modify(req.params.postId, req.body);
    res.redirect(`/posts/${req.params.postId}`);
  }
);

/* Edit Post Form. */
router.get('/:postId/edit',
  control.isLoggedIn,
  control.checkAuthorPermission,
  async (req, res, next) => {
    const postsWithUser = await postDao.read(req.params.postId);
    res.render('posts/edit', {
      postWithUser: postsWithUser[0],
      inputDatas: req.flash('inputDatas')[0],
      inputErrors: req.flash('inputErrors')[0]
    });
  }
);

/* Delete Post. */
router.delete('/:postId',
  control.isLoggedIn,
  control.checkAuthorPermission,
  async (req, res, next) => {
    await postDao.destroy(req.params.postId);
    res.redirect(`/posts/`);
  }
);

/* Show Post Content. */
router.get('/:postId',
  async (req, res, next) => {
    const postsWithUser = await postDao.read(req.params.postId);
    res.render('posts/show', {
      postWithUser: postsWithUser[0],
      category: res.locals.categories.find( category => category.id == postsWithUser[0].category_id ),
      search: undefined
    });
  }
);

module.exports = router;
