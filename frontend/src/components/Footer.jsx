import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Owner Info */}
                <div className="text-center md:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
                        Owner
                    </h2>
                    <p className="text-base sm:text-lg mt-2 sm:mt-3 text-gray-300">
                        <span className="font-medium">Satyam Sawant</span>
                    </p>
                </div>

                {/* About Travelify */}
                <div className="text-center md:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
                        About Travelify
                    </h2>
                    <p className="text-base sm:text-lg mt-2 sm:mt-3 leading-relaxed text-gray-300">
                        Travelify is your trusted travel partner to explore the world and joy.
                    </p>
                </div>
            </div>

            {/* Bottom Line */}
            <p className="text-center text-gray-400 text-xs sm:text-sm mt-6 sm:mt-8 tracking-wide">
                Created with <span className="text-red-500">♥️</span> by <span className="text-white font-bold">Satyam Sawant</span>
            </p>
        </footer>
    );
};

export default Footer;
