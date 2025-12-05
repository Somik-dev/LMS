import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema(
  {
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture", // Assuming you have a Lecture model
      required: true,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false } // prevents automatic _id generation for subdocuments
);

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Assuming you have a Course model
      required: true,
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lectureProgress: {
      type: [lectureProgressSchema],
      default: [],
    },
  },
  { timestamps: true } // adds createdAt and updatedAt fields
);

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
