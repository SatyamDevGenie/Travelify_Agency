import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Contact = () => {
    // Contact Info Card Component
    const ContactCard = ({ icon: Icon, title, info, colorClass }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${colorClass} group hover:scale-105`}
        >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${colorClass.replace('border-l-4', 'bg').replace('blue-500', 'blue-100')} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`text-xl ${colorClass.replace('border-l-4', 'text').replace('500', '600')}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{info}</p>
        </motion.div>
    );

    // Social Media Link Component
    const SocialLink = ({ icon: Icon, href, colorClass }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${colorClass} text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
        >
            <Icon className="text-xl" />
        </a>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="container-fluid relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                                Get in{" "}
                                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                                    Touch
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
                                Ready to embark on your next adventure? We're here to help you plan the perfect journey.
                                Reach out to our travel experts and let's make your dream trip a reality.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Information Section */}
            <section className="py-16 lg:py-20">
                <div className="container-fluid">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        <ContactCard
                            icon={FaMapMarkerAlt}
                            title="Visit Our Office"
                            info="123 Travel Street, Adventure City, AC 12345, India"
                            colorClass="border-l-4 border-blue-500"
                        />
                        <ContactCard
                            icon={FaPhone}
                            title="Call Us"
                            info="+91 98765 43210"
                            colorClass="border-l-4 border-emerald-500"
                        />
                        <ContactCard
                            icon={FaEnvelope}
                            title="Email Us"
                            info="hello@travelify.com"
                            colorClass="border-l-4 border-purple-500"
                        />
                        <ContactCard
                            icon={FaClock}
                            title="Business Hours"
                            info="Mon - Fri: 9:00 AM - 6:00 PM IST"
                            colorClass="border-l-4 border-orange-500"
                        />
                    </div>
                </div>
            </section>

            {/* Map and Contact Details Section */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="container-fluid">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Map */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 h-96 flex items-center justify-center shadow-lg">
                                <div className="text-center">
                                    <FaMapMarkerAlt className="text-6xl text-blue-500 mb-4 mx-auto" />
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Find Us Here</h3>
                                    <p className="text-slate-600">Interactive map coming soon</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                                    Let's Start Planning Your Adventure
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                    Whether you're looking for a peaceful beach getaway, an exciting mountain trek,
                                    or a cultural city exploration, our team of travel experts is ready to help you
                                    create unforgettable memories.
                                </p>
                            </div>

                            {/* Quick Contact Info */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FaPhone className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Quick Call</p>
                                        <p className="text-slate-600">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <FaEnvelope className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Email Support</p>
                                        <p className="text-slate-600">hello@travelify.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-4">Follow Our Journey</h3>
                                <div className="flex space-x-4">
                                    <SocialLink
                                        icon={FaFacebook}
                                        href="https://facebook.com/travelify"
                                        colorClass="bg-blue-600 hover:bg-blue-700"
                                    />
                                    <SocialLink
                                        icon={FaTwitter}
                                        href="https://twitter.com/travelify"
                                        colorClass="bg-sky-500 hover:bg-sky-600"
                                    />
                                    <SocialLink
                                        icon={FaInstagram}
                                        href="https://instagram.com/travelify"
                                        colorClass="bg-pink-500 hover:bg-pink-600"
                                    />
                                    <SocialLink
                                        icon={FaLinkedin}
                                        href="https://linkedin.com/company/travelify"
                                        colorClass="bg-blue-700 hover:bg-blue-800"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container-fluid">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-slate-600">
                            Quick answers to common questions about our travel services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">
                                How do I book a tour?
                            </h3>
                            <p className="text-slate-600">
                                Simply browse our tours, select your preferred package, and follow the booking process.
                                You can pay securely online or contact us for assistance.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white p-6 rounded-2xl shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">
                                What's your cancellation policy?
                            </h3>
                            <p className="text-slate-600">
                                We offer flexible cancellation policies depending on the tour package.
                                Contact us for specific details about your booking.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white p-6 rounded-2xl shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">
                                Do you provide travel insurance?
                            </h3>
                            <p className="text-slate-600">
                                Yes, we can help you arrange comprehensive travel insurance to protect your trip.
                                Ask our team about available options.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-white p-6 rounded-2xl shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">
                                Can I customize my tour?
                            </h3>
                            <p className="text-slate-600">
                                Absolutely! We specialize in creating personalized travel experiences.
                                Contact us to discuss your specific requirements and preferences.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
                <div className="container-fluid text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Don't wait any longer. Your dream destination is just a click away.
                            Let's make your travel dreams come true!
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;