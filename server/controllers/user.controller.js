import { User } from "../Models/user.models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../utils/cloudinary.js";

// ===============================
// REGISTER
// ===============================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      photoUrl: "",
    });

    // Return token after register
    return generateToken(res, newUser, "Account created successfully");

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ success: false, message: "Failed to register" });
  }
};

// ===============================
// LOGIN
// ===============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    return generateToken(res, user, `Welcome back, ${user.name}`);
    
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Failed to login" });
  }
};

// ===============================
// LOGOUT
// ===============================
export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const sameSiteOption = isProduction ? "None" : "Lax"; // ✅ Correct capitalization

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: sameSiteOption,
      path: "/",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ success: false, message: "Failed to logout" });
  }
};

// ===============================
// GET USER PROFILE
// ===============================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate({
        path: "enrolledCourses",
        select: "courseTitle subtitle category thumbnailUrl courseLevel coursePrice lectures enrolledStudents creator",
        populate: { path: "creator", select: "name avatar" },
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });

  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ success: false, message: "Cannot fetch user profile" });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let updatedPhotoUrl = user.photoUrl;

    if (file) {
      if (user.photoUrl) {
        const publicId = user.photoUrl.split("/").slice(-1)[0].split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      const cloud = await uploadMedia(file.path);
      updatedPhotoUrl = cloud.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, photoUrl: updatedPhotoUrl },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};
