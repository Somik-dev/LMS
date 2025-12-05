import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  getCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  resetCourseProgress,
  updateLectureProgress,
} from "../controllers/courseProgressController.js";

const router = express.Router();

// Get overall course progress for a user
router.get("/:courseId", isAuthenticated, getCourseProgress);

// Mark individual lecture as viewed
router.post("/:courseId/lecture/:lectureId/view", isAuthenticated, updateLectureProgress);

// Mark entire course as completed
router.patch("/:courseId/complete", isAuthenticated, markAsCompleted);

// Mark entire course as incomplete
router.patch("/:courseId/incomplete", isAuthenticated, markAsInCompleted);

// Reset course progress (start over)
router.patch("/:courseId/reset", isAuthenticated, resetCourseProgress);

export default router;

