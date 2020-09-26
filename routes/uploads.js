const express = require('express');
const router = express.Router();
const fileDao = require('../models/File');
const multer = require('multer');
const uploadImage = multer({ dest: 'public/uploads/images/' });

/* Upload Images. */
router.post('/images',
  uploadImage.single('upload'),
  async (req, res, next) => {
    await fileDao.create(req.file);
    res.json({ url: req.file.path.slice(6) });
  }
);

module.exports = router;