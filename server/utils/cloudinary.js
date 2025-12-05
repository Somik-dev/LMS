import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

/* ------------------------------------------------------------------
   VALIDATE ENV CONFIG
------------------------------------------------------------------- */
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  throw new Error("❌ Missing Cloudinary environment variables.");
}

/* ------------------------------------------------------------------
   CLOUDINARY CONFIG
------------------------------------------------------------------- */
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

/* ------------------------------------------------------------------
   UPLOAD MEDIA (Image / Video / Raw)
   Auto-detects file type automatically
------------------------------------------------------------------- */
export const uploadMedia = async (filePath) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // auto-detect type
    });

    // Delete local file after uploading
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      duration: uploadResponse.duration || null,
      type: uploadResponse.resource_type,
    };

  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw new Error(error.message);
  }
};

/* ------------------------------------------------------------------
   DELETE ANY MEDIA (image / video / raw)
------------------------------------------------------------------- */
export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });
  } catch (error) {
    console.error("❌ Cloudinary Delete Error:", error);
    throw new Error(error.message);
  }
};

/* ------------------------------------------------------------------
   DELETE VIDEO (Requires explicit 'video' resource type)
------------------------------------------------------------------- */
export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    console.log("✅ Cloudinary Video Deleted:", result);
    return result;

  } catch (error) {
    console.error("❌ Cloudinary Video Delete Error:", error);
    throw new Error(error.message);
  }
};
