import Tour from "../models/tourModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// @desc Get all tours
export const getTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.json(tours);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// @desc Get single tour
export const getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        res.json({
            success: true,
            data: tour,
        });

    } catch (error) {
        console.error("Error fetching single tour:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching tour"
        });
    }
};



// @desc Create new tour (Admin)
export const createTour = async (req, res) => {
    try {
        // Destructure data from request body
        const { title, description, price, availableSlots, location, category, subcategory } = req.body;

        // Validate required fields
        if (!title || !description || !price || !availableSlots || !location || !category || !subcategory) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Upload image if provided
        let imageUrl = "";
        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: "travel_tours",
                use_filename: true,
                unique_filename: false,
            });
            imageUrl = uploadedImage.secure_url;

            // Remove local file after upload
            fs.unlinkSync(req.file.path);
        } else {
            return res.status(400).json({ message: "Tour image is required" });
        }

        // Create new tour document
        const tour = await Tour.create({
            title,
            description,
            price,
            availableSlots,
            location,
            category,
            subcategory,
            image: imageUrl,
        });

        // Success response
        res.status(201).json({
            success: true,
            message: "Tour created successfully",
            data: tour,
        });
    } catch (error) {
        console.error("Error creating tour:", error);

        // Check for Mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ message: messages.join(", ") });
        }

        // Fallback server error
        res.status(500).json({ message: "Server error: unable to create tour" });
    }
};

// @desc Update tour (Admin)
export const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) return res.status(404).json({ message: "Tour not found" });

        console.log("Request body:", req.body); // Debug

        const {
            title,
            description,
            price,
            availableSlots,
            location,
            category,
            subcategory,
        } = req.body;

        // Update image if uploaded
        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: "travel_tours",
            });
            tour.image = uploadedImage.secure_url;
            fs.unlinkSync(req.file.path);
        }

        // Update fields (all as strings first, convert numbers where needed)
        if (title) tour.title = title;
        if (description) tour.description = description;
        if (price) tour.price = Number(price);
        if (availableSlots) tour.availableSlots = Number(availableSlots);
        if (location) tour.location = location; // <== important
        if (category) tour.category = category;
        if (subcategory) tour.subcategory = subcategory;

        const updatedTour = await tour.save();

        res.json({
            success: true,
            message: "Tour updated successfully",
            data: updatedTour,
        });
    } catch (error) {
        console.error("Error updating tour:", error);
        res.status(500).json({ message: "Error updating tour" });
    }
};





// @desc Delete tour (Admin)
export const deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) return res.status(404).json({ message: "Tour not found" });

        await tour.deleteOne();
        res.json({ success: true, message: "Tour deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting tour" });
    }
};



