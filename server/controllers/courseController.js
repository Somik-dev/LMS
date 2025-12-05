import mongoose from "mongoose";
import { Course } from "../Models/course.model.js";
import { Lecture } from "../Models/lecture.model.js";
import {
  uploadMedia,
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";

/* ============================================================
   COURSE CONTROLLERS
============================================================ */

/**
 * CREATE COURSE
 */
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and category are required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create Course Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * GET ALL CREATOR COURSES
 */
export const getAllCreatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.user.id }).populate("lectures");
    return res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Get Courses Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * EDIT COURSE
 */
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const {
      courseTitle,
      subtitle,
      description,
      category,
      courseLevel,
      coursePrice,
      isPublished,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let thumbnailUrl = course.thumbnailUrl;

    // Upload new thumbnail
    if (req.file) {
      if (course.thumbnailUrl) {
        const publicId = course.thumbnailUrl.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      const uploaded = await uploadMedia(req.file.path);
      thumbnailUrl = uploaded.url;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        ...(courseTitle && { courseTitle }),
        ...(subtitle && { subtitle }),
        ...(description && { description }),
        ...(category && { category }),
        ...(courseLevel && { courseLevel }),
        ...(coursePrice !== undefined && { coursePrice }),
        ...(typeof isPublished !== "undefined" && { isPublished }),
        thumbnailUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Edit Course Error:", error);
    return res.status(500).json({ message: "Failed to update course" });
  }
};

/**
 * GET COURSE BY ID
 */
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Get Course Error:", error);
    return res.status(500).json({ message: "Failed to get course" });
  }
};

/* ============================================================
   LECTURE CONTROLLERS
============================================================ */

/**
 * CREATE LECTURE
 */
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({ message: "Lecture title and courseId required" });
    }

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const exists = course.lectures.some(
      (lec) => lec.lectureTitle.toLowerCase() === lectureTitle.toLowerCase()
    );

    if (exists)
      return res.status(409).json({ message: "Lecture already exists" });

    const lecture = await Lecture.create({ lectureTitle });

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.error("Create Lecture Error:", error);
    return res.status(500).json({ message: "Failed to create lecture" });
  }
};

/**
 * GET COURSE LECTURES
 */
export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) return res.status(404).json({ message: "Course not found" });

    return res.status(200).json({ success: true, lectures: course.lectures });
  } catch (error) {
    console.error("Get Lectures Error:", error);
    return res.status(500).json({ message: "Failed to get lectures" });
  }
};

/**
 * GET LECTURE BY ID
 */
export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    return res.status(200).json({ success: true, lecture });
  } catch (error) {
    console.error("Get Lecture Error:", error);
    return res.status(500).json({ message: "Failed to get lecture" });
  }
};

/**
 * EDIT LECTURE
 * Accepts: lectureTitle, videoUrl, publicId, isPreviewFree
 */
// PUT /creator/:courseId/lecture/:lectureId
export const editLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const { lectureTitle, videoUrl, publicId, isPreviewFree } = req.body;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture)
      return res.status(404).json({ success: false, message: "Lecture not found" });

    // --- SAVE TITLE ---
    lecture.lectureTitle = lectureTitle;

    // --- SAVE VIDEO WHEN EDIT ONLY ---
    if (videoUrl && publicId) {
      lecture.videoUrl = videoUrl;
      lecture.publicId = publicId;
    }

    // --- SAVE PREVIEW OPTION ---
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    res.status(200).json({
      success: true,
      message: "Lecture updated",
      lecture,
    });

  } catch (error) {
    console.error("EDIT LECTURE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/**
 * REMOVE LECTURE
 */
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    await Course.updateMany(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

    await lecture.deleteOne();

    return res.status(200).json({ success: true, message: "Lecture removed" });
  } catch (error) {
    console.error("Remove Lecture Error:", error);
    return res.status(500).json({ message: "Failed to remove lecture" });
  }
};

/* ============================================================
   SEARCH / PUBLISH CONTROLLERS
============================================================ */

export const searchCourse = async (req, res) => {
  try {
    const { query = "", sortByPrice = "" } = req.query;
    let categories = req.query.categories || "";

    const regex = { $regex: query, $options: "i" };

    categories = categories ? categories.split(",") : [];

    const searchCriteria = {
      isPublished: true,
      $or: [{ courseTitle: regex }, { subtitle: regex }, { category: regex }],
    };

    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    const sortOptions = {};
    if (sortByPrice === "low") sortOptions.coursePrice = 1;
    if (sortByPrice === "high") sortOptions.coursePrice = -1;

    const courses = await Course.find(searchCriteria)
      .populate("creator", "name photoUrl")
      .sort(sortOptions);

    return res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({ message: "Search failed" });
  }
};

export const getPublishedCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate("creator", "name photoUrl");

    return res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Published Courses Error:", error);
    return res.status(500).json({ message: "Failed to retrieve published courses" });
  }
};

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.isPublished = !course.isPublished;
    await course.save();

    return res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? "published" : "unpublished"} successfully`,
    });
  } catch (error) {
    console.error("Toggle Publish Error:", error);
    return res.status(500).json({ message: "Failed to update publish status" });
  }
};

/**
 * DELETE COURSE (Remove course + all lectures + cloudinary videos)
 */
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1️⃣ Check valid ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    // 2️⃣ Find course with lectures
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 3️⃣ Delete each lecture + cloudinary video
    for (const lecture of course.lectures) {
      // delete video from cloudinary if exists
      if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
      }

      // delete lecture from DB
      await Lecture.findByIdAndDelete(lecture._id);
    }

    // 4️⃣ Delete course thumbnail if exists
    if (course.thumbnailUrl) {
      const publicId = course.thumbnailUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    // 5️⃣ Delete the course itself
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course and all associated lectures deleted successfully",
    });

  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

