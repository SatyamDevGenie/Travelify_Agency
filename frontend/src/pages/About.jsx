import React from "react";

const About = () => {
    return (
        <div className="">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
                }}
            >
                <div className=" bg-opacity-50 p-8 rounded-xl text-center max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white">
                        About Travelify
                    </h1>
                    <p className="text-gray-950 mt-4 text-lg">
                        Your trusted partner for unforgettable travel experiences.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-700">
                        Our Mission
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        At Travelify, our mission is to make travel simple, affordable,
                        and magical. We bring the world closer to you by offering
                        premium travel packages, transparent bookings, and personalized
                        experiences tailored for every traveler.
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-700">
                        Why Choose Travelify?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white shadow-lg p-6 rounded-xl hover:shadow-2xl transition">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/854/854894.png"
                                className="h-16 mx-auto mb-4"
                                alt="Icon"
                            />
                            <h3 className="text-xl font-bold mb-2 text-center">
                                Best Price Guarantee
                            </h3>
                            <p className="text-gray-600 text-center">
                                We provide the most affordable travel packages without
                                compromising on quality.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white shadow-lg p-6 rounded-xl hover:shadow-2xl transition">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1287/1287238.png"
                                className="h-16 mx-auto mb-4"
                                alt="Icon"
                            />
                            <h3 className="text-xl font-bold mb-2 text-center">
                                Expert Travel Guides
                            </h3>
                            <p className="text-gray-600 text-center">
                                Our expert team ensures safe, fun, and informative trips
                                around the world.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white shadow-lg p-6 rounded-xl hover:shadow-2xl transition">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135689.png"
                                className="h-16 mx-auto mb-4"
                                alt="Icon"
                            />
                            <h3 className="text-xl font-bold mb-2 text-center">
                                24/7 Customer Support
                            </h3>
                            <p className="text-gray-600 text-center">
                                We are always available to help you before, during, and
                                after your journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-10 text-blue-700">
                        Meet Our Team
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Team Member 1 */}
                        <div className="bg-white p-6 shadow-lg rounded-xl hover:shadow-2xl transition">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                className="w-32 h-32 rounded-full mx-auto mb-4"
                                alt=""
                            />
                            <h3 className="text-xl font-bold">Adam Smith</h3>
                            {/* <p className="text-blue-600 font-semibold">Founder & CEO</p> */}
                        </div>

                        {/* Team Member 2 */}
                        <div className="bg-white p-6 shadow-lg rounded-xl hover:shadow-2xl transition">
                            <img
                                src="https://randomuser.me/api/portraits/women/45.jpg"
                                className="w-32 h-32 rounded-full mx-auto mb-4"
                                alt=""
                            />
                            <h3 className="text-xl font-bold">Alisha Pheraria</h3>
                            {/* <p className="text-blue-600 font-semibold">
                                Travel Consultant
                            </p> */}
                        </div>

                        {/* Team Member 3 */}
                        <div className="bg-white p-6 shadow-lg rounded-xl hover:shadow-2xl transition">
                            <img
                                src="https://randomuser.me/api/portraits/men/77.jpg"
                                className="w-32 h-32 rounded-full mx-auto mb-4"
                                alt=""
                            />
                            <h3 className="text-xl font-bold">Sabin Philip</h3>
                            {/* <p className="text-blue-600 font-semibold">Tour Manager</p> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 bg-blue-700 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready for your next adventure?
                </h2>
                <p className="text-lg mb-6">
                    Book your dream vacation today with Travelify.
                </p>
                <a
                    href="/"
                    className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100"
                >
                    Explore Tours
                </a>
            </section>
        </div>
    );
};

export default About;
