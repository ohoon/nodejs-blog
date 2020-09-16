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
        const userId = await postDao.read(req.params.postId);

        if (userId !== req.user[0].id) {
            return res.redirect('/');
        }
        next();
    },
}