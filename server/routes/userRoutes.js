import express from 'express';
import { registerUser, loginUser, getUserById } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// The :id param matches req.params.id in your getUserById controller
router.get('/:id', protect, getUserById);


export default router;