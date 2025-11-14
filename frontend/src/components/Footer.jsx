import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Owner Info */}
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">Owner</h2>
                    <p className="text-base mt-3 text-gray-300">
                        <span className="font-medium">Satyam Sawant</span>
                    </p>
                </div>

                {/* About Travelify */}
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">About Travelify</h2>
                    <p className="text-base mt-3 leading-relaxed text-gray-300">
                        Travelify is your trusted travel partner to explore the world with comfort and joy.
                    </p>
                </div>
            </div>

            {/* Bottom Line */}
            <p className="text-center text-gray-400 text-sm mt-8 tracking-wide">
                Created with ♥️ by <span className="text-white font-bold">Satyam Sawant</span>
            </p>
        </footer>
    );
};

export default Footer;
