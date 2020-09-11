const express = require('express');
const router = express.Router();
const userDao = require('../models/User');

/* Sign Up User. */
router.post('/', user.encryptPassword, async (req, res, next) => {
  await userDao.create(req.body);
  res.redirect('/');
});

/* Sign Up Form. */
router.get('/signup', (req, res, next) => {
  res.render('users/new', { });
});

module.exports = router;
