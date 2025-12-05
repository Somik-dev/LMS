import express from 'express';
import {
  register,
  login,
  logout,
  getUserProfile,
  updateProfile
} from '../controllers/user.controller.js';

import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../utils/multer.js';

const router = express.Router();

// 📝 Register new user
router.post('/register', register);

// 🔐 Login user
router.post('/login', login);

// 🚪 Logout user
router.post('/logout', logout);

// 👤 Get current user profile (protected route)
router.get('/profile', isAuthenticated, getUserProfile);

// Update profile
router.put('/profile/update',isAuthenticated,upload.single("profilePhoto"),updateProfile)

export default router;
