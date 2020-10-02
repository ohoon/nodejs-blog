const express = require('express');
const router = express.Router();
const userDao = require('../models/User');
const control = require('../utils/control');
const input = require('../utils/input');
const crypt = require('../utils/crypt');
const multer = require('multer');
const uploadProfile = multer({ dest: 'public/uploads/profiles/' });

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

/* Edit User Form. */
router.get('/:userId',
  control.isLoggedIn,
  control.checkUserPermission,
  async (req, res, next) => {
    const users = await userDao.findById(req.params.userId);
    res.render('users/edit', {
      user: users[0],
      inputDatas: req.flash('inputDatas')[0],
      inputErrors: req.flash('inputErrors')[0]
    });
  }
);

/* Edit User. */
router.put('/:userId',
  control.isLoggedIn,
  control.checkUserPermission,
  uploadProfile.single('profile'),
  input.checkEditUser,
  crypt.encryptPassword,
  (req, res, next) => {
    req.body.user_id = req.params.userId;
    req.body.profile = req.file ? req.file.path.slice(6) : undefined;
    next();
  },
  async (req, res, next) => {
    await userDao.modify(req.body);
    res.redirect('/');
  }
);

module.exports = router;
