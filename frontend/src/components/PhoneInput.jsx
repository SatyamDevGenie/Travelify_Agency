import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { countryCodes } from "../data/countryCodes";

const PhoneInput = ({ value, onChange, className = "", required = false }) => {
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]); // Default to India
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Filter countries based on search term
    const filteredCountries = countryCodes.filter(country =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm)
    );

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isDropdownOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isDropdownOpen]);

    // Parse existing value if provided
    useEffect(() => {
        if (value) {
            // Try to extract country code from the value
            const matchedCountry = countryCodes.find(country => 
                value.startsWith(country.code)
            );
            
            if (matchedCountry) {
                setSelectedCountry(matchedCountry);
                setPhoneNumber(value.substring(matchedCountry.code.length));
            } else {
                setPhoneNumber(value);
            }
        }
    }, [value]);

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setSearchTerm("");
        
        // Update the full phone number
        const fullNumber = country.code + phoneNumber;
        onChange(fullNumber);
    };

    const handlePhoneNumberChange = (e) => {
        const number = e.target.value.replace(/[^\d]/g, ""); // Only allow digits
        setPhoneNumber(number);
        
        // Update the full phone number
        const fullNumber = selectedCountry.code + number;
        onChange(fullNumber);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setSearchTerm("");
    };

    return (
        <div className="relative">
            <div className={`flex ${className}`}>
                {/* Country Code Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={toggleDropdown}
                        className="flex items-center space-x-2 px-3 py-3 bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[120px]"
                    >
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium text-gray-700">{selectedCountry.code}</span>
                        <FaChevronDown className={`text-xs text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 z-50 w-80 bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                            {/* Search */}
                            <div className="p-3 border-b border-gray-200">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search countries..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Countries List */}
                            <div className="max-h-60 overflow-y-auto">
                                {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => handleCountrySelect(country)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                                                selectedCountry.code === country.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                            }`}
                                        >
                                            <span className="text-lg">{country.flag}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">{country.country}</div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-500">{country.code}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                        No countries found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="Enter phone number"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required={required}
                />
            </div>

            {/* Helper Text */}
            <div className="mt-1 text-xs text-gray-500">
                Full number: {selectedCountry.code}{phoneNumber ? phoneNumber : "XXXXXXXXXX"}
            </div>
        </div>
    );
};

export default PhoneInput;