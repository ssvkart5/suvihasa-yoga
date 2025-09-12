const { uploadMedia } = require('../utils/blobUpload');

exports.upload = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const url = await uploadMedia(file.buffer, file.originalname);
  res.json({ url });
};
