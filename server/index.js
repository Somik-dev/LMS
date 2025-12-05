import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import mediaRoute from "./routes/media.route.js";
import coureProgressRoute from "./routes/coureProgress.route.js";

dotenv.config();
const app = express();

// Database
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parsers
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", coureProgressRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
