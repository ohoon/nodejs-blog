const postDao = require('../models/Post');
const commentDao = require('../models/Comment');

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash('error', 'Login is required');
            return res.redirect('/login');
        }
        next();
    },
    checkUserPermission: (req, res, next) => {
        const userId = req.params.userId;

        if (userId != req.user[0].id) {
            return res.redirect('/');
        }
        next();
    },
    checkAuthorPermission: async (req, res, next) => {
        const postsWithUser = await postDao.read(req.params.postId);
        const userId = postsWithUser[0].user_id;

        if (userId !== req.user[0].id) {
            return res.redirect('/');
        }
        next();
    },
    checkCommentAuthorPermission: async (req, res, next) => {
        const commentsWithUser = await commentDao.read(req.params.commentId);
        const userId = commentsWithUser[0].user_id;
        const postId = commentsWithUser[0].post_id;

        if (userId !== req.user[0].id) {
            return res.redirect(`/posts/${postId}`);
        }
        next();
    },
    checkPostId: async (req, res, next) => {
        const postsWithUser = await postDao.read(req.query.postId);

        if (postsWithUser.length === 0) {
            return res.redirect(`/posts/`);
        }
        next();
    }
}