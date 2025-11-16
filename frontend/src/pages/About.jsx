import React from "react";

const About = () => {
    // Value Card Component
    const ValueCard = ({ iconUrl, title, description, colorClass }) => (
        <div className={`relative bg-white shadow-2xl p-6 sm:p-8 rounded-2xl border-t-4 ${colorClass} transition duration-500 transform hover:scale-[1.03] hover:shadow-3xl`}>
            <div className="flex justify-center mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-full ${colorClass.replace('-4', '-1')} ring-4 ring-offset-2 ${colorClass.replace('-4', '-400').replace('border-t-4', 'ring')}`}>
                    <img
                        src={iconUrl}
                        className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                        alt={title}
                    />
                </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-2 sm:mb-3 text-gray-900 text-center">
                {title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">
                {description}
            </p>
        </div>
    );

    // Team Member Component
    const TeamMemberCard = ({ imageSrc, name, role, colorClass }) => (
        <div className="bg-white p-6 sm:p-8 shadow-xl rounded-2xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-100">
            <img
                src={imageSrc}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full mx-auto mb-4 sm:mb-5 object-cover border-4 border-white ring-4 ring-indigo-300"
                alt={`Portrait of ${name}`}
            />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{name}</h3>
            <p className={`text-base sm:text-lg font-semibold ${colorClass}`}>{role}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 italic">
                "Driven by a passion for exploration."
            </p>
        </div>
    );

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
                }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                <div className="relative p-6 sm:p-8 text-center max-w-4xl animate-fadeInUp">
                    <p className="text-lg sm:text-xl font-semibold text-yellow-400 uppercase tracking-[0.3em] mb-2 sm:mb-3 drop-shadow-lg">
                        Our Story
                    </p>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-2xl">
                        Travelify
                    </h1>
                    <p className="text-gray-200 mt-2 sm:mt-4 text-lg sm:text-2xl font-medium drop-shadow-lg">
                        Crafting unforgettable travel experiences, one journey at a time.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-600 to-purple-700">
                <div className="max-w-7xl mx-auto text-center px-4 sm:px-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-white leading-snug">
                        Our Core Purpose
                    </h2>
                    <p className="text-indigo-100 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-4xl mx-auto border-t-2 border-b-2 border-indigo-400 py-4">
                        At Travelify, our mission is to make travel simple, affordable,
                        and magical. We believe the world is meant to be explored. We bring the world closer to you by offering
                        premium travel packages, transparent bookings, and personalized
                        experiences tailored for every traveler, fostering connection and discovery.
                    </p>
                    <div className="mt-6 text-white text-2xl sm:text-3xl opacity-70">
                        🌍✈️✨
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 text-gray-900">
                        The Travelify Promise
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
                        <ValueCard
                            iconUrl="https://cdn-icons-png.flaticon.com/512/854/854894.png"
                            title="Unbeatable Value"
                            description="We provide the most affordable travel packages without compromising on quality or experience, guaranteeing maximum return on your wanderlust investment."
                            colorClass="border-blue-500"
                        />
                        <ValueCard
                            iconUrl="https://cdn-icons-png.flaticon.com/512/1287/1287238.png"
                            title="Guided Expertise"
                            description="Our hand-picked guides ensure safe, fun, and profoundly informative trips, offering insights and access unavailable to typical tourists."
                            colorClass="border-green-500"
                        />
                        <ValueCard
                            iconUrl="https://cdn-icons-png.flaticon.com/512/3135/3135689.png"
                            title="24/7 Global Support"
                            description="Travel with peace of mind. We are always available to offer personalized support before, during, and after your journey, anywhere in the world."
                            colorClass="border-red-500"
                        />
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 sm:py-24 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-12 sm:mb-16">
                        Meet Our Global Explorers
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
                        <TeamMemberCard
                            imageSrc="https://randomuser.me/api/portraits/men/32.jpg"
                            name="Adam Smith"
                            role="Founder & CEO"
                            colorClass="text-indigo-600"
                        />
                        <TeamMemberCard
                            imageSrc="https://randomuser.me/api/portraits/women/45.jpg"
                            name="Alisha Pheraria"
                            role="Lead Travel Consultant"
                            colorClass="text-green-600"
                        />
                        <TeamMemberCard
                            imageSrc="https://randomuser.me/api/portraits/men/77.jpg"
                            name="Sabin Philip"
                            role="Chief Tour Manager"
                            colorClass="text-purple-600"
                        />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-700 to-cyan-600 text-center text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
                        Ready for your next adventure?
                    </h2>
                    <p className="text-lg sm:text-xl mb-6 sm:mb-8 font-light">
                        Browse our curated destinations and let us handle the rest.
                    </p>
                    <a
                        href="/tours"
                        className="inline-flex items-center justify-center space-x-2 bg-white text-blue-700 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-extrabold text-base sm:text-lg shadow-xl hover:bg-gray-100 transform hover:scale-[1.05] transition duration-300 ring-4 ring-white/50"
                    >
                        <span>🧭 Explore Exclusive Tours</span>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;
