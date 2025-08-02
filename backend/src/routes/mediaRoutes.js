import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadMedia, getMedia, deleteMedia, downloadZip } from '../controllers/mediaController.js';

const router = express.Router();

router.route('/')
  .get(protect, getMedia);

router.post('/upload', protect, upload.single('file'), uploadMedia);
router.post('/download-zip', protect, downloadZip);

router.route('/:id')
  .delete(protect, deleteMedia);

export default router;
