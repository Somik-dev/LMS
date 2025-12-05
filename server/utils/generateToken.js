import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  try {
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined in environment variables");
    }

    // Create token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role, 
        name: user.name 
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    const sameSiteOption = isProduction ? "none" : "Lax"; // ✅ Capital 'N' for None

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,            // ✅ Cannot be accessed by JS
      secure: isProduction,      // ✅ Must be true in production for SameSite=None
      sameSite: sameSiteOption,  // ✅ Correct capitalization
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",                 // ✅ Important for clearing cookie
    });

    // Remove password before sending response
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
    };

    return res.status(200).json({
      success: true,
      message,
      user: safeUser
    });

  } catch (error) {
    console.error("Error generating token:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
