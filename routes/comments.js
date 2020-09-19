const express = require('express');
const router = express.Router();
const commentDao = require('../models/Comment');
const control = require('../utils/control');
const input = require('../utils/input');

/* Create Comment. */
router.post('/',
  control.isLoggedIn,
  control.checkPostId,
  input.checkCreateComment,
  (req, res, next) => {
    req.body.post_id = req.query.postId;
    req.body.user_id = req.user[0].id;
    req.body.parent_comment_id = req.query.parentId?req.query.parentId:null;
    next();
  },
  async (req, res, next) => {
    await commentDao.create(req.body);
    res.redirect(`/posts/${req.query.postId}`);
  }
);

/* Delete Comment. */
router.delete('/:commentId',
  control.isLoggedIn,
  control.checkCommentAuthorPermission,
  control.checkPostId,
  async (req, res, next) => {
    await commentDao.destroy(req.params.commentId);
    res.redirect(`/posts/${req.query.postId}`);
  }
);

module.exports = router;