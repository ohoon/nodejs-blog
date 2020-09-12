const express = require('express');
const router = express.Router();
const postDao = require('../models/Post');
const passport = require('../config/passport');

/* Home Page. */
router.get('/', async (req, res, next) => {
  const posts = await postDao.find();
  res.render('home/index', { posts: posts });
});

/* Log In Form. */
router.get('/login', (req, res, next) => {
  res.render('home/login', {
    username: req.flash('username')[0],
    inputErrors: req.flash('inputErrors')[0],
    loginError: req.flash('error')[0]
  });
});

/* Log In */
router.post('/login',
  (req, res, next) => {
    if (!req.body.username) {
      req.flash('inputErrors', { username: 'error' });
      res.redirect('/login');
    }
    if (!req.body.password) {
      req.flash('username', req.body.username);
      req.flash('inputErrors', { password: 'error' });
      res.redirect('/login');
    }

    next();
  },
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

/* Log Out */
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
})

module.exports = router;
