import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import {
  createCheckoutSession,
  getAllPurchaseCourse,
  getCourseDetailsWithPurchaseStatus,
  stripeWebhook,
} from '../controllers/coursePurchaseController.js';

const router = express.Router();

// ---------------------------
// 🔐 Protected Routes (Requires Auth)
// ---------------------------

// 🎯 Create Stripe Checkout Session
router.post(
  '/checkout/create-checkout-session',
  isAuthenticated,
  createCheckoutSession
);

// 🎯 Get Course Details with Purchase Status
router.get(
  '/course/:courseId/details-with-status',
  isAuthenticated,
  getCourseDetailsWithPurchaseStatus
);

// 🎯 Get All Purchased Courses
router.get(
  '/',
  isAuthenticated,
  getAllPurchaseCourse
);

// ---------------------------
// ⚡ Public Routes (No Auth Required)
// ---------------------------

// 🎯 Stripe Webhook (raw body required for signature verification)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

export default router;

