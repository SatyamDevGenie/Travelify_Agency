import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Tours from "../components/Tours";
import BlockbusterOffers from "../components/Offers";

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                            Discover Your Next
                            <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                Adventure
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Explore breathtaking destinations and create unforgettable memories with our curated travel experiences.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/tours"
                                className="btn-primary text-lg px-8 py-4 bg-white text-slate-900 hover:bg-slate-100"
                            >
                                Explore Tours
                            </Link>
                            <Link
                                to="/about"
                                className="btn-secondary text-lg px-8 py-4 bg-transparent border-white text-white hover:bg-white/10"
                            >
                                Learn More
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container-fluid">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Why Choose Travelify?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We make travel planning effortless with our professional booking system and exceptional service.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🌍",
                                title: "Curated Destinations",
                                description: "Handpicked locations that offer the best experiences and value for your journey."
                            },
                            {
                                icon: "⚡",
                                title: "Instant Booking",
                                description: "Quick and secure booking process with immediate confirmation and email notifications."
                            },
                            {
                                icon: "🛡️",
                                title: "Trusted Service",
                                description: "Professional support team and transparent pricing with no hidden fees."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card hover-lift text-center p-8"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tours Section */}
            <section className="py-20 bg-slate-50">
                <div className="container-fluid">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Popular Destinations
                        </h2>
                        <p className="text-lg text-slate-600">
                            Discover our most loved travel experiences
                        </p>
                    </motion.div>
                    <Tours />
                </div>
            </section>

            {/* Offers Section */}
            <section className="py-20 bg-white">
                <div className="container-fluid">
                    <BlockbusterOffers />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="container-fluid text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Ready for Your Next Adventure?
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of travelers who trust Travelify for their perfect getaway.
                        </p>
                        <Link
                            to="/tours"
                            className="btn-primary text-lg px-8 py-4 bg-white text-slate-900 hover:bg-slate-100"
                        >
                            Start Planning Today
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;


