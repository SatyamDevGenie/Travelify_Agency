import { getCoordinatesFromLocation } from "./services/geocodingService.js";

// Test the geocoding service
const testLocations = [
    "Goa, India",
    "Manali, India", 
    "Bali, Indonesia",
    "Dubai, UAE",
    "Thailand",
    "London, UK"
];

console.log("🗺️ Testing GPS Geocoding Service...\n");

for (const location of testLocations) {
    try {
        console.log(`📍 Testing: ${location}`);
        const result = await getCoordinatesFromLocation(location);
        
        if (result.success) {
            console.log(`✅ Success: ${result.data.coordinates.latitude}, ${result.data.coordinates.longitude}`);
            console.log(`   Address: ${result.data.name}`);
        } else {
            console.log(`❌ Failed: ${result.message}`);
        }
        
        console.log(""); // Empty line for readability
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
    } catch (error) {
        console.log(`💥 Error: ${error.message}\n`);
    }
}

console.log("🎉 GPS Testing Complete!");
process.exit(0);