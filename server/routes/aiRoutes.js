import express from 'express';
import { enhanceProSummary, enhancejobdescription, uploadResume } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const airouter = express.Router();

airouter.post('/enhance-pro-sum', protect, enhanceProSummary);
airouter.post('/enhance-job-desc', protect, enhancejobdescription);
airouter.post('/upload-resume', protect, uploadResume);

export default airouter;