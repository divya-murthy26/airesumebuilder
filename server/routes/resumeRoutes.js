import express from 'express';
import {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  togglePublicStatus,
  uploadResumeImage,
  uploadResumeFile,
  enhanceText
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../configs/upload.middleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createResume)
  .get(protect, getAllResumes);

router.route('/:id')
  .get(protect, getResumeById)
  .put(protect, updateResume)
  .delete(protect, deleteResume);

router.patch('/:id/toggle-public', protect, togglePublicStatus);

router.post('/:id/image', protect, upload.single('image'), uploadResumeImage);

router.post('/:id/upload', protect, upload.single('resumeFile'), uploadResumeFile);

router.post('/enhance-text', protect, enhanceText);

export default router;