// routes/media.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const uploadToBlob = require('../utils/blobUpload');

// Multer setup for file parsing
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload media (Instructor/Admin only)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!['instructor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const blobUrl = await uploadToBlob(req.file);
    res.status(201).json({ url: blobUrl });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

module.exports = router;
