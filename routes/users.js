const express = require('express');
const router = express.Router();
const userDao = require('../models/User');
const input = require('../utils/input');
const crypt = require('../utils/crypt');

/* Sign Up User. */
router.post('/',
  input.checkSignUp,
  crypt.encryptPassword,
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

/* Edit Form. */
router.get('/:userId', async (req, res, next) => {
  const users = await userDao.findById(req.params.userId);
  res.render('users/edit', {
    user: users[0],
    inputDatas: req.flash('inputDatas')[0],
    inputErrors: req.flash('inputErrors')[0]
  });
});

module.exports = router;
