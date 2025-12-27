import mongoose from "mongoose";
import User from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const createTestUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Create a test user with different email
        const testEmail = "testuser@example.com"; // You can change this to any email
        
        // Check if test user already exists
        const existingUser = await User.findOne({ email: testEmail });
        
        if (existingUser) {
            console.log("Test user already exists!");
            console.log("Email:", existingUser.email);
            console.log("Name:", existingUser.name);
        } else {
            // Create new test user
            const testUser = await User.create({
                name: "Test User",
                email: testEmail,
                password: "test123", // This will be hashed automatically
                isAdmin: false
            });
            
            console.log("Test user created successfully!");
            console.log("Email:", testUser.email);
            console.log("Password: test123");
            console.log("Name:", testUser.name);
        }
        
        console.log("\n💡 Now you can:");
        console.log("1. Login with this test user");
        console.log("2. Book a tour");
        console.log("3. Admin can reject the booking");
        console.log("4. Email will be sent to:", testEmail);
        
        process.exit(0);
    } catch (error) {
        console.error("Error creating test user:", error);
        process.exit(1);
    }
};

createTestUser();