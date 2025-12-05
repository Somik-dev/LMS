import { Course } from "../Models/course.model.js";
import { CourseProgress } from "../Models/courseProgress.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Step 1: Validate course
   const courseDetails = await Course.findById(courseId).populate("lectures").lean();
    if (!courseDetails) {
      return res.status(404).json({ message: "Course not found!" });
    }

    // Step 2: Get user's progress (if any)
    const courseProgress = await CourseProgress.findOne({ courseId, userId });

    // Step 3: Return course details and progress
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress?.lectureProgress || [],
        completed: courseProgress?.completed || false,
      },
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return res.status(500).json({
      message: "An error occurred while fetching course progress.",
    });
  }
};


export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.user?.id;

    if (!userId || !courseId || !lectureId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const lectureExists = course.lectures.some(
      (lecture) => lecture._id.toString() === lectureId
    );

    if (!lectureExists) {
      return res.status(404).json({ message: "Lecture not found in this course." });
    }

    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId.toString() === lectureId
    );

    if (lectureIndex !== -1) {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    const totalLectures = course.lectures.length;
    const viewedLectures = courseProgress.lectureProgress.filter(
      (lecture) => lecture.viewed
    ).length;

    courseProgress.completed = viewedLectures === totalLectures;

    await courseProgress.save();

    return res.status(200).json({
      message: "Lecture progress updated successfully.",
      completed: courseProgress.completed,
      progressCount: `${viewedLectures}/${totalLectures}`,
    });

  } catch (error) {
    console.error("Error updating lecture progress:", error);
    return res.status(500).json({
      message: "An error occurred while updating lecture progress.",
    });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId || !courseId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      return res.status(404).json({ message: "Course progress not found." });
    }

    // Mark all lectures as viewed
    courseProgress.lectureProgress.forEach((lectureProgress) => {
      lectureProgress.viewed = true;
    });

    // Mark course as completed
    courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({
      message: "Course marked as completed.",
      completed: true,
      totalLectures: courseProgress.lectureProgress.length,
    });

  } catch (error) {
    console.error("Error marking course as completed:", error);
    return res.status(500).json({
      message: "An error occurred while marking course as completed.",
    });
  }
};


export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId || !courseId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      return res.status(404).json({ message: "Course progress not found." });
    }

    // Mark all lectures as not viewed
    courseProgress.lectureProgress.forEach((lectureProgress) => {
      lectureProgress.viewed = false;
    });

    // Mark course as not completed
    courseProgress.completed = false;

    await courseProgress.save();

    return res.status(200).json({
      message: "Course marked as incomplete.",
      completed: false,
      totalLectures: courseProgress.lectureProgress.length,
    });

  } catch (error) {
    console.error("Error marking course as incomplete:", error);
    return res.status(500).json({
      message: "An error occurred while marking course as incomplete.",
    });
  }
};

export const resetCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId || !courseId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      return res.status(404).json({ message: "Course progress not found." });
    }

    // Completely reset lecture progress and completion status
    courseProgress.lectureProgress = [];
    courseProgress.completed = false;

    await courseProgress.save();

    return res.status(200).json({
      message: "Course progress has been reset.",
      completed: false,
      lectureProgress: [],
    });

  } catch (error) {
    console.error("Error resetting course progress:", error);
    return res.status(500).json({
      message: "An error occurred while resetting course progress.",
    });
  }
};