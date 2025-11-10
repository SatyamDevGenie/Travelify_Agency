import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import tourRoutes from "./routes/tourRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json());

// Routes
app.use("/api/users", authRoutes);
app.use("/api/tours", tourRoutes)

// Example routes
app.get("/", (req, res) => res.send("Travelify API is running..."));


// 404 Middleware
app.use(notFound);

// Error Handling Middleware
app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
