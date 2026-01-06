import Tour from "../models/tourModel.js";
import { getCoordinatesFromLocation } from "../services/geocodingService.js";

/**
 * Utility function to update existing tours with GPS coordinates
 * Run this once to add GPS data to existing tours
 */
export const updateExistingToursWithGPS = async () => {
    try {
        console.log("Starting GPS update for existing tours...");
        
        // Find all tours without GPS data
        const toursWithoutGPS = await Tour.find({
            $or: [
                { gpsLocation: { $exists: false } },
                { "gpsLocation.coordinates.latitude": { $exists: false } }
            ]
        });

        console.log(`Found ${toursWithoutGPS.length} tours without GPS data`);

        let updatedCount = 0;
        let failedCount = 0;

        for (const tour of toursWithoutGPS) {
            try {
                console.log(`Processing tour: ${tour.title} - ${tour.location}`);
                
                // Get GPS coordinates for the location
                const gpsResult = await getCoordinatesFromLocation(tour.location);
                
                if (gpsResult.success) {
                    // Update the tour with GPS data
                    await Tour.findByIdAndUpdate(tour._id, {
                        gpsLocation: gpsResult.data
                    });
                    
                    console.log(`✅ Updated ${tour.title} with GPS coordinates:`, gpsResult.data.coordinates);
                    updatedCount++;
                } else {
                    console.log(`❌ Failed to get GPS for ${tour.title}: ${gpsResult.message}`);
                    failedCount++;
                }

                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`Error updating tour ${tour.title}:`, error);
                failedCount++;
            }
        }

        console.log(`\n📊 GPS Update Summary:`);
        console.log(`✅ Successfully updated: ${updatedCount} tours`);
        console.log(`❌ Failed to update: ${failedCount} tours`);
        console.log(`📍 Total processed: ${toursWithoutGPS.length} tours`);

        return {
            success: true,
            updated: updatedCount,
            failed: failedCount,
            total: toursWithoutGPS.length
        };

    } catch (error) {
        console.error("Error in GPS update process:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Update a specific tour with GPS coordinates
 */
export const updateSingleTourWithGPS = async (tourId) => {
    try {
        const tour = await Tour.findById(tourId);
        
        if (!tour) {
            return { success: false, message: "Tour not found" };
        }

        const gpsResult = await getCoordinatesFromLocation(tour.location);
        
        if (gpsResult.success) {
            await Tour.findByIdAndUpdate(tourId, {
                gpsLocation: gpsResult.data
            });
            
            return {
                success: true,
                message: `GPS coordinates updated for ${tour.title}`,
                data: gpsResult.data
            };
        } else {
            return {
                success: false,
                message: `Could not find GPS coordinates for ${tour.location}`
            };
        }

    } catch (error) {
        console.error("Error updating single tour GPS:", error);
        return {
            success: false,
            message: "Error updating GPS coordinates",
            error: error.message
        };
    }
};