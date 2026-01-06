import mongoose from "mongoose";
import dotenv from "dotenv";
import Tour from "./models/tourModel.js";
import { getCoordinatesFromLocation } from "./services/geocodingService.js";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const updateToursWithGPS = async () => {
    try {
        await connectDB();
        
        console.log("🗺️ Starting GPS update for all tours...\n");
        
        // Find all tours without GPS data
        const tours = await Tour.find({
            $or: [
                { gpsLocation: { $exists: false } },
                { "gpsLocation.coordinates.latitude": { $exists: false } }
            ]
        });

        console.log(`Found ${tours.length} tours without GPS data\n`);

        let updated = 0;
        let failed = 0;

        for (const tour of tours) {
            try {
                console.log(`📍 Processing: ${tour.title} - ${tour.location}`);
                
                const gpsResult = await getCoordinatesFromLocation(tour.location);
                
                if (gpsResult.success) {
                    await Tour.findByIdAndUpdate(tour._id, {
                        gpsLocation: gpsResult.data
                    });
                    
                    console.log(`✅ Updated: ${gpsResult.data.coordinates.latitude}, ${gpsResult.data.coordinates.longitude}`);
                    updated++;
                } else {
                    console.log(`❌ Failed: ${gpsResult.message}`);
                    failed++;
                }

                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`💥 Error updating ${tour.title}:`, error.message);
                failed++;
            }
        }

        console.log(`\n📊 Update Summary:`);
        console.log(`✅ Successfully updated: ${updated} tours`);
        console.log(`❌ Failed to update: ${failed} tours`);
        console.log(`📍 Total processed: ${tours.length} tours`);

    } catch (error) {
        console.error("💥 Error:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

updateToursWithGPS();