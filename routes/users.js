const express = require('express');
const router = express.Router();
const userDao = require('../models/User');

/* Sign Up User. */
router.post('/',
  async (req, res, next) => {
    const users = await userDao.findByUsername(req.body.username);

    if (req.body.username.length < 5 || req.body.username.length > 20) {
      req.flash('inputDatas', req.body);
      req.flash('inputErrors', { username: 'Username should be 5-20 words.' });
      return res.redirect('/users/signup');
    }
    if (req.body.password.length < 8 || req.body.password.length > 40) {
      req.flash('inputDatas', req.body);
      req.flash('inputErrors', { password: 'Password should be 8-40 words.' });
      return res.redirect('/users/signup');
    }
    if (req.body.password !== req.body.confirm_password) {
      req.flash('inputDatas', req.body);
      req.flash('inputErrors', { confirm_password: 'Password and Confirm Password should be same.' });
      return res.redirect('/users/signup');
    }
    if (!req.body.nickname) {
      req.flash('inputDatas', req.body);
      req.flash('inputErrors', { nickname: 'Nickname is required.' });
      return res.redirect('/users/signup');
    }
    if (await users.length > 0) {
      req.flash('inputDatas', req.body);
      req.flash('inputErrors', { username: 'Username already exists.' });
      return res.redirect('/users/signup');
    }
    
    next();
  },
  userDao.encryptPassword,
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  },
  async (req, res, next) => {
    const userId = await userDao.create(req.body);
    const users = await userDao.findById(userId);
    req.logIn(users[0], (err) => res.redirect('/'));
  }
);

/* Sign Up Form. */
router.get('/signup', (req, res, next) => {
  res.render('users/new', {
    inputDatas: req.flash('inputDatas')[0],
    inputErrors: req.flash('inputErrors')[0]
  });
});

module.exports = router;
