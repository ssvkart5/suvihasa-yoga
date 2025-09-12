const express = require('express');
const multer = require('multer');
const router = express.Router();
const { upload } = require('../controllers/mediaController');

const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage });

router.post('/upload', uploadMiddleware.single('file'), upload);

module.exports = router;
