import React from "react";
import { motion } from "framer-motion";
import Tours from "../components/Tours";
import BlockbusterOffers from "../components/Offers";

const Home = () => {
    return (
        <div className="w-full overflow-hidden">

            {/* Hero Section */}
            <section
                className="
                    relative 
                    h-[75vh] 
                    md:h-[85vh] 
                    lg:h-[90vh] 
                    flex 
                    items-center 
                    justify-center 
                    bg-cover 
                    bg-center 
                    bg-no-repeat
                "
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative text-center text-white px-4 sm:px-6 max-w-3xl"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
                        Discover your next Adventure
                    </h1>

                    <p className="mt-4 text-base sm:text-lg md:text-xl font-light opacity-90">
                        Explore breathtaking destinations with Travelify.
                    </p>

                    <button
                        className="
                            mt-6 
                            bg-blue-600 
                            hover:bg-blue-700 
                            text-white 
                            px-6 
                            sm:px-8 
                            py-3 
                            rounded-full 
                            font-semibold 
                            text-sm 
                            sm:text-base 
                            transition 
                            shadow-lg
                        "
                    >
                        Book Now
                    </button>
                </motion.div>
            </section>

            {/* Tours Section */}
            <div className="px-4 sm:px-6 lg:px-10 py-10">
                <Tours />
            </div>

            {/* Blockbuster Offers */}
            <BlockbusterOffers />

        </div>
    );
};

export default Home;


