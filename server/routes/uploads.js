const express = require('express');
const multer = require('multer');

module.exports = (db) => {
  const router = express.Router();

  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image uploads are allowed'), false);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 5 }
  });

  router.post('/posts', upload.array('photos', 5), async (req, res) => {
    try {
      const { post_id } = req.query;
      const postId = Number(post_id);

      if (!postId) {
        return res.status(400).json({ error: 'post_id is required' });
      }

      const files = req.files || [];
      if (!files.length) {
        return res.status(400).json({ error: 'No images provided' });
      }

      const host = `${req.protocol}://${req.get('host')}`;
      const urls = [];

      for (const file of files) {
        const [result] = await db.execute(
          'INSERT INTO post_images (post_id, mime_type, image_data) VALUES (?, ?, ?)',
          [postId, file.mimetype, file.buffer]
        );

        const imageId = result.insertId;
        urls.push(`${host}/api/posts/${postId}/images/${imageId}`);
      }

      res.json({ success: true, urls });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to upload files' });
    }
  });

  return router;
};
