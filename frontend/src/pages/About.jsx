import React from "react";

const About = () => {
    // Value Card Component
    const ValueCard = ({ iconUrl, title, description, colorClass }) => (
        <div className={`relative bg-white shadow-lg p-6 sm:p-8 rounded-xl border-t-4 ${colorClass} transition duration-300 hover:shadow-xl`}>
            <div className="flex justify-center mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-full bg-gray-100`}>
                    <img
                        src={iconUrl}
                        className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                        alt={title}
                    />
                </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 text-center">
                {title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">
                {description}
            </p>
        </div>
    );

    // Team Member Component
    const TeamMemberCard = ({ imageSrc, name, role, colorClass }) => (
        <div className="bg-white p-6 sm:p-8 shadow-lg rounded-xl hover:shadow-xl transition duration-300 border border-gray-100">
            <img
                src={imageSrc}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 sm:mb-5 object-cover border-4 border-gray-200"
                alt={`Portrait of ${name}`}
            />
            <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{name}</h3>
                <p className={`text-base sm:text-lg font-semibold ${colorClass} mb-2`}>{role}</p>
                <p className="text-xs sm:text-sm text-gray-500 italic">
                    "Passionate about creating amazing travel experiences"
                </p>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 sm:py-32">
                <div className="max-w-6xl mx-auto text-center px-4 sm:px-6">
                    <p className="text-lg sm:text-xl font-semibold text-blue-200 uppercase tracking-wide mb-4">
                        Our Story
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                        About Travelify
                    </h1>
                    <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        Crafting unforgettable travel experiences, one journey at a time. 
                        We're passionate about making your travel dreams come true.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
                            Our Mission
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
                                At Travelify, our mission is to make travel simple, affordable, and magical. 
                                We believe the world is meant to be explored, and we're here to make that exploration 
                                as seamless and enjoyable as possible.
                            </p>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                We bring the world closer to you by offering premium travel packages, 
                                transparent bookings, and personalized experiences tailored for every traveler, 
                                fostering connection and discovery across the globe.
                            </p>
                        </div>
                    </div>
                    
                    {/* Mission Icons */}
                    <div className="flex justify-center space-x-8 mt-12">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🌍</div>
                            <p className="text-sm font-medium text-gray-600">Global Reach</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-2">✈️</div>
                            <p className="text-sm font-medium text-gray-600">Seamless Travel</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-2">❤️</div>
                            <p className="text-sm font-medium text-gray-600">Passionate Service</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 sm:py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-900">
                        Why Choose Travelify
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <ValueCard
                            iconUrl="https://cdn-icons-png.flaticon.com/512/854/854894.png"
                            title="Best Value"
                            description="We provide the most competitive travel packages without compromising on quality or experience, ensuring maximum value for your investment."
                            colorClass="border-blue-500"
                        />
                        <ValueCard
                            iconUrl="https://cdn-icons-png.flaticon.com/512/1287/1287238.png"
                            title="Expert Guidance"
                            description="Our experienced travel consultants and guides ensure safe, informative, and memorable trips with insider access and local expertise."
                            colorClass="border-green-500"
                        />
                        <ValueCard
                            iconUrl="https://cdn-icons-png.flaticon.com/512/3135/3135689.png"
                            title="24/7 Support"
                            description="Travel with confidence knowing our dedicated support team is available around the clock to assist you before, during, and after your journey."
                            colorClass="border-purple-500"
                        />
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our passionate team of travel experts is dedicated to making your journey extraordinary.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <TeamMemberCard
                            imageSrc="https://randomuser.me/api/portraits/men/32.jpg"
                            name="Adam Smith"
                            role="Founder & CEO"
                            colorClass="text-blue-600"
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

            {/* Stats Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold mb-2">500+</div>
                            <p className="text-blue-200">Happy Travelers</p>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold mb-2">50+</div>
                            <p className="text-blue-200">Destinations</p>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold mb-2">5</div>
                            <p className="text-blue-200">Years Experience</p>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
                            <p className="text-blue-200">Customer Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 bg-gray-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to Start Your Adventure?
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-300 mb-8">
                        Browse our curated destinations and let us handle the rest.
                    </p>
                    <a
                        href="/tours"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
                    >
                        Explore Our Tours
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;