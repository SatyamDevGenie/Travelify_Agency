import mongoose from "mongoose";
import User from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "satyam@travelify.com" });
        
        if (existingAdmin) {
            console.log("Admin user already exists!");
            console.log("Email:", existingAdmin.email);
            console.log("Is Admin:", existingAdmin.isAdmin);
            
            // Update to make sure they're admin
            existingAdmin.isAdmin = true;
            await existingAdmin.save();
            console.log("Updated admin status to true");
        } else {
            // Create new admin user
            const adminUser = await User.create({
                name: "Satyam Admin",
                email: "satyam@travelify.com",
                password: "admin123", // This will be hashed automatically
                isAdmin: true
            });
            
            console.log("Admin user created successfully!");
            console.log("Email:", adminUser.email);
            console.log("Password: admin123");
            console.log("Is Admin:", adminUser.isAdmin);
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();