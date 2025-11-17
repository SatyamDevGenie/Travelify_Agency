import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const offersData = [
    {
        id: 1,
        title: "Goa Beach Escape",
        desc: "3 Nights • Premium Resort • Water Sports",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=80",
        discount: "40% OFF",
        timer: 48
    },
    {
        id: 2,
        title: "Manali Adventure",
        desc: "Trek • Camping • Rafting",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1500&q=80",
        discount: "Bestseller",
        timer: 72
    },
    {
        id: 3,
        title: "Dubai Luxury Tour",
        desc: "City Tour • Safari • Burj Khalifa",
        image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1500&q=80",
        discount: "Limited Time",
        timer: 24
    }
];

// Format Countdown
const formatTime = (hoursLeft) => {
    const days = Math.floor(hoursLeft / 24);
    const hours = hoursLeft % 24;
    return `${days}d ${hours}h`;
};

const BlockbusterOffers = () => {
    const [current, setCurrent] = useState(0);
    const [modalData, setModalData] = useState(null);

    // Auto Slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % offersData.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => setCurrent((current + 1) % offersData.length);
    const prevSlide = () =>
        setCurrent(current === 0 ? offersData.length - 1 : current - 1);

    return (
        <section className="py-16 sm:py-20 px-3 sm:px-6 lg:px-10 bg-gradient-to-b from-yellow-50 to-white">

            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-10 sm:mb-14"
            >
                🚀 Blockbuster Offers
            </motion.h2>

            {/* Slider */}
            <div className="relative max-w-3xl md:max-w-4xl mx-auto">

                <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl relative">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={offersData[current].id}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            {/* Background Image */}
                            <img
                                src={offersData[current].image}
                                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                            />

                            {/* Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent"></div>

                            {/* Tag */}
                            <motion.span
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-600 px-3 py-1 sm:px-5 text-white text-xs sm:text-sm rounded-full font-bold shadow-xl"
                            >
                                {offersData[current].discount}
                            </motion.span>

                            {/* Timer */}
                            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/80 backdrop-blur px-3 py-1 text-[11px] sm:text-sm rounded-full shadow font-semibold">
                                ⏳ {formatTime(offersData[current].timer)}
                            </span>

                            {/* Bottom Content */}
                            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white">
                                <h3 className="text-xl sm:text-3xl font-bold drop-shadow-lg">
                                    {offersData[current].title}
                                </h3>
                                <p className="text-xs sm:text-sm mt-1 opacity-90">
                                    {offersData[current].desc}
                                </p>

                                <button
                                    onClick={() => setModalData(offersData[current])}
                                    className="mt-3 sm:mt-4 px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg text-sm"
                                >
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-3 bg-white/80 backdrop-blur p-2 sm:p-3 rounded-full shadow hover:bg-white text-sm"
                >
                    ◀
                </button>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 bg-white/80 backdrop-blur p-2 sm:p-3 rounded-full shadow hover:bg-white text-sm"
                >
                    ▶
                </button>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {modalData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999]"
                        onClick={() => setModalData(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.85 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.85 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full shadow-xl p-4 sm:p-6"
                        >
                            <img
                                src={modalData.image}
                                className="rounded-xl mb-4"
                            />

                            <h2 className="text-xl sm:text-2xl font-bold">
                                {modalData.title}
                            </h2>
                            <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                {modalData.desc}
                            </p>

                            <p className="mt-3 text-xs sm:text-sm font-semibold">
                                ⏳ Offer Ends: {formatTime(modalData.timer)}
                            </p>

                            <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow text-sm sm:text-base">
                                Book Now
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default BlockbusterOffers;
