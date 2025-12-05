import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
      videoUrl: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    isPreviewFree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);

