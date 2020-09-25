const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadImage = multer({ dest: '/uploads/images' });

/* Upload Images. */
router.post('/images',
  uploadImage.single('upload'),
  (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    console.log(req.file.filename);
    res.redirect('/');
  }
);

module.exports = router;