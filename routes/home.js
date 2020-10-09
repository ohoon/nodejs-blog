const express = require('express');
const router = express.Router();
const postDao = require('../models/Post');
const passport = require('../config/passport');
const input = require('../utils/input');

/* Home Page. */
router.get('/', async (req, res, next) => {
  const page = 1;
  const limit = 3;
  const postsWithUser = await postDao.find(0, page, limit);
  res.render('home/index', { postsWithUser: postsWithUser });
});

/* Log In Form. */
router.get('/login',
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  },
  (req, res, next) => {
    res.render('home/login', {
      username: req.flash('username')[0],
      inputErrors: req.flash('inputErrors')[0],
      loginError: req.flash('error')[0]
    });
  }
);

/* Log In */
router.post('/login',
  input.checkLogIn,
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

/* Log Out */
router.get('/logout',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  },
  (req, res, next) => {
    req.logout();
    res.redirect('/');
  }
);

/* Chat Room */
router.get('/chat',
  (req, res, next) => {
    res.render('home/chat');
  }
);

module.exports = router;
