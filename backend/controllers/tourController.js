import Tour from "../models/Tour.js";
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
        const { title, description, price, availableSlots, location } = req.body;

        let imageUrl = "";
        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: "travel_tours",
            });
            imageUrl = uploadedImage.secure_url;

            // ✅ Delete local temp file after upload
            fs.unlinkSync(req.file.path);
        }

        const tour = await Tour.create({
            title,
            description,
            price,
            availableSlots,
            location,
            image: imageUrl,
        });

        res.status(201).json({
            success: true,
            message: "Tour created successfully",
            data: tour,
        });
    } catch (error) {
        console.error("Error creating tour:", error);
        res.status(500).json({ message: "Error creating tour" });
    }
};

// @desc Update tour (Admin)
export const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) return res.status(404).json({ message: "Tour not found" });

        const { title, description, price, availableSlots, location } = req.body;

        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: "travel_tours",
            });
            tour.image = uploadedImage.secure_url;
            fs.unlinkSync(req.file.path);
        }

        tour.title = title || tour.title;
        tour.description = description || tour.description;
        tour.price = price || tour.price;
        tour.availableSlots = availableSlots || tour.availableSlots;
        tour.location = location || tour.location;

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



