import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../utils/multer.js";

import {
  createCourse,
  createLecture,
  deleteCourse,
  editCourse,
  editLecture,
  getAllCreatorCourses,
  getCourseById,
  getCourseLectures,
  getLectureById,
  getPublishedCourse,
  removeLecture,
  searchCourse,
  togglePublishCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// COURSE ROUTES
// ─────────────────────────────────────────────────────────────

// @route   POST /api/v1/course/create
// @desc    Create a new course (with thumbnail upload)
// @access  Private (creator only)
router.post("/create", isAuthenticated, upload.single("thumbnail"), createCourse);


// @route   GET /api/v1/course/search
// @desc    Search courses (with filters)
// @access  Private (Authenticated users only)
router.get("/search", isAuthenticated, searchCourse);

// @route   get /api/v1/course/publish
// @desc    published courses (with thumbnail upload)
// @access  Private (creator only)
router.get("/creator/publish-course", isAuthenticated, getPublishedCourse);


// @route   GET /api/v1/course/creator
// @desc    Get all courses created by the logged-in creator
// @access  Private
router.get("/creator", isAuthenticated, getAllCreatorCourses);

// @route   PUT /api/v1/course/creator/:courseId
// @desc    Update a specific course by ID (with thumbnail upload)
// @access  Private
router.put("/creator/:courseId", isAuthenticated, upload.single("thumbnail"), editCourse);

// @route   GET /api/v1/course/creator/:courseId
// @desc    Get a specific course by ID for the logged-in creator
// @access  Private
router.get("/creator/:courseId", isAuthenticated, getCourseById);

// ─────────────────────────────────────────────────────────────
// LECTURE ROUTES
// ─────────────────────────────────────────────────────────────

// @route   POST /api/v1/course/creator/:courseId/lecture
// @desc    Add a new lecture to a specific course
// @access  Private
router.post("/creator/:courseId/lecture", isAuthenticated, createLecture);

// @route   GET /api/v1/course/creator/:courseId/lecture
// @desc    Get all lectures of a specific course
// @access  Private
router.get("/creator/:courseId/lecture", isAuthenticated, getCourseLectures);

// @route   GET /api/v1/course/creator/lecture/:lectureId
// @desc    Get a specific lecture by ID
// @access  Private
router.get("/creator/lecture/:lectureId", isAuthenticated, getLectureById);

// @route   PUT /api/v1/course/creator/:courseId/lecture/:lectureId
// @desc    Update a specific lecture by ID
// @access  Private
router.put("/creator/:courseId/lecture/:lectureId", isAuthenticated, editLecture);

// @route   DELETE /api/v1/course/creator/lecture/:lectureId
// @desc    Remove a specific lecture by ID
// @access  Private
router.delete("/creator/lecture/:lectureId", isAuthenticated, removeLecture);

// @route   PUT /api/v1/course/creator/:courseId
// @desc    Publish a specific Course by ID
// @access  Private
router.patch("/creator/:courseId/publish", isAuthenticated, togglePublishCourse);


router.delete("/creator/:courseId", isAuthenticated, deleteCourse);


export default router;


