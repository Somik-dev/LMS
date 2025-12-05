import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

/* ------------------------------------------------------------------
   @route   POST /creator/upload-video
   @desc    Upload a video to Cloudinary
   @access  Creator (protected if needed)
------------------------------------------------------------------- */
router.post(
  "/creator/upload-video",
  upload.single("file"),
  async (req, res) => {
    try {
      // No file uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "❌ No file uploaded.",
        });
      }

      console.log("📤 Uploading file to Cloudinary:", req.file.path);

      // Upload to Cloudinary
      const result = await uploadMedia(req.file.path);

      return res.status(200).json({
        success: true,
        message: "✅ Video uploaded successfully",
        data: {
          url: result.url,
          publicId: result.publicId,
          duration: result.duration || null,
          type: result.type || "video",
        },
      });
    } catch (error) {
      console.error("❌ Video upload error:", error);

      return res.status(500).json({
        success: false,
        message: "❌ Video upload failed.",
        error: error.message,
      });
    }
  }
);

export default router;
