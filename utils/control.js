const postDao = require('../models/Post');

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash('error', 'Login is required');
            return res.redirect('/login');
        }
        next();
    },
    checkAuthorPermission: async (req, res, next) => {
        const posts = await postDao.read(req.params.postId);
        const userId = posts[0].user_id;

        if (userId !== req.user[0].id) {
            return res.redirect('/');
        }
        next();
    },
}