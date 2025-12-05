import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };

    next();
  } catch (error) {
    console.log("Authentication Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default isAuthenticated;

