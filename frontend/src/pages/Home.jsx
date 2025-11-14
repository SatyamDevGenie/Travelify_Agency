import React from "react";
import { motion } from "framer-motion";

const Home = () => {
    return (
        <div className="mt-0">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/50"></div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative text-center text-white px-6"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Discover Your Next Adventure
                    </h1>
                    <p className="text-lg md:text-xl mb-6">
                        Explore breathtaking destinations with Travelify.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition">
                        Book Now
                    </button>
                </motion.div>
            </section>

        </div>
    );
};

export default Home;
