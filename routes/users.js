const express = require('express');
const router = express.Router();
const user = require('../models/user');

/* Sign Up User. */
router.post('/', user.encryptPassword, async (req, res, next) => {
  await user.create(req.body);
  res.redirect('/');
});

/* Sign Up Form. */
router.get('/signup', (req, res, next) => {
  res.render('users/new', { });
});

module.exports = router;
