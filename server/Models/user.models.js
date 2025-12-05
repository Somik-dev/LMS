import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email format validation
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["instructor", "student"],
            default: "student",
        },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        photoUrl: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Export the model
export const User = mongoose.model("User", userSchema);
