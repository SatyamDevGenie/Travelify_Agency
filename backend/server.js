import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // ⚠️ Important
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import photoWishlistRoutes from "./routes/photoWishlistRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json());

// Routes
app.use("/api/users", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/photo-wishlist", photoWishlistRoutes);



// Example routes
app.get("/", (req, res) => res.send("Travelify API is running..."));


// 404 Middleware
app.use(notFound);

// Error Handling Middleware
app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
