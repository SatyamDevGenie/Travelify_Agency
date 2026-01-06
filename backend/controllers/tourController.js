import Tour from "../models/tourModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { getCoordinatesFromLocation } from "../services/geocodingService.js";
import { updateExistingToursWithGPS, updateSingleTourWithGPS } from "../utils/updateToursWithGPS.js";

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

        // Get GPS coordinates for the location
        const gpsResult = await getCoordinatesFromLocation(location);
        let gpsLocation = null;
        
        if (gpsResult.success) {
            gpsLocation = gpsResult.data;
            console.log(`GPS coordinates found for ${location}:`, gpsLocation.coordinates);
        } else {
            console.warn(`Could not find GPS coordinates for ${location}:`, gpsResult.message);
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
            gpsLocation: gpsLocation
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

        // Get GPS coordinates for the location
        const gpsResult = await getCoordinatesFromLocation(location);
        let gpsLocation = null;
        
        if (gpsResult.success) {
            gpsLocation = gpsResult.data;
            console.log(`GPS coordinates found for ${location}:`, gpsLocation.coordinates);
        } else {
            console.warn(`Could not find GPS coordinates for ${location}:`, gpsResult.message);
        }

        // Update fields (all as strings first, convert numbers where needed)
        if (title) tour.title = title;
        if (description) tour.description = description;
        if (price) tour.price = Number(price);
        if (availableSlots) tour.availableSlots = Number(availableSlots);
        if (location) {
            tour.location = location;
            // Update GPS coordinates if location changed
            if (gpsLocation) {
                tour.gpsLocation = gpsLocation;
            }
        }
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




// @desc Update all tours with GPS coordinates (Admin only)
export const updateAllToursWithGPS = async (req, res) => {
    try {
        const result = await updateExistingToursWithGPS();
        
        if (result.success) {
            res.json({
                success: true,
                message: "GPS update process completed",
                data: {
                    updated: result.updated,
                    failed: result.failed,
                    total: result.total
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: "GPS update process failed",
                error: result.error
            });
        }
    } catch (error) {
        console.error("Error in GPS update endpoint:", error);
        res.status(500).json({
            success: false,
            message: "Error updating tours with GPS data",
            error: error.message
        });
    }
};

// @desc Update single tour with GPS coordinates (Admin only)
export const updateTourGPS = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateSingleTourWithGPS(id);
        
        if (result.success) {
            res.json({
                success: true,
                message: result.message,
                data: result.data
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error("Error updating single tour GPS:", error);
        res.status(500).json({
            success: false,
            message: "Error updating tour GPS coordinates",
            error: error.message
        });
    }
};