import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineUser, AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Custom = () => {
    const [scrollY, setScrollY] = useState(0);
    const [showCityList, setShowCityList] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showHeroSearch, setShowHeroSearch] = useState(true);
    const controls = useAnimation();

    const cities = [
        'Delhi to Mumbai',
        'Mumbai to Delhi',
        'Chennai to Bangalore',
        'Kolkata to Hyderabad',
        'Pune to Goa',
        'Ahmedabad to Jaipur',
        'Lucknow to Patna',
        'Indore to Bhopal',
        'Surat to Vadodara',
        'Nagpur to Kanpur',
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            setShowHeroSearch(window.scrollY === 0);
        };

        window.addEventListener('scroll', handleScroll);

        if (scrollY > 10) {
            controls.start({ opacity: 1, display: 'flex', transition: { duration: 0.3 } });
        } else {
            controls.start({ opacity: 0, display: 'none', transition: { duration: 0.3 } });
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollY, controls]);

    return (
        <main className='bg-[#453efb]'>
            <div className="relative  text-white max-w-7xl mx-auto">
                {/* Navbar */}
                <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4  ">
                    <a href="/" className="flex items-center space-x-2">
                        <div className="text-xl font-bold">atlys</div>
                        <span className="text-sm">VISAS ON TIME</span>
                    </a>

                    {scrollY > 10 && (
                        <motion.div
                            className="hidden md:flex relative items-center w-1/2"
                            animate={controls}
                        >
                            <FiSearch className="absolute left-3 text-gray-400" />
                            <input
                                type="text"
                                className="w-full py-2 pl-10 pr-10 text-black rounded-lg"
                                placeholder="Where to?"
                            />
                        </motion.div>
                    )}
                    {/* User Icon and Menu Icon */}
                    <div className="flex items-center space-x-4">
                        <div className="flex gap-5">
                            <p className='leading-tight'>on Time
                                <br />
                                Guaranteed</p>
                            <AiOutlineUser className="text-2xl cursor-pointer" />
                        </div>
                        <AiOutlineMenu
                            className="text-2xl cursor-pointer md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </div>
                    

                    {isMobileMenuOpen && (
                        <motion.div
                            className="absolute top-16 left-0 w-full bg-[#453efb] shadow-md text-white md:hidden"
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="p-4 flex flex-col">
                                <div className="relative mb-4">
                                    <FiSearch className="absolute left-3 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full py-2 pl-10 pr-10 text-black rounded-lg"
                                        placeholder="Where to?"
                                    />
                                </div>
                                {/* <AiOutlineUser className="text-2xl self-end cursor-pointer" /> */}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Hero Section */}
                <div className="relative flex flex-col items-center justify-center h-80 text-center bg-[#453efb]">
                    <div className="text-sm font-semibold text-green-300">99.2% visas on time</div>
                    <h1 className="text-4xl font-bold">Get Your Visa on Time with Atlys</h1>
                    {showHeroSearch && (
                        <motion.div
                            className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 w-full max-w-3xl"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: showHeroSearch ? 1 : 0 }}
                        >
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-8 text-xl text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full py-7 pl-12 pr-10 text-black rounded-2xl shadow-lg"
                                    style={{ border: "5px solid #453efb" }}
                                    placeholder="Where to?"
                                    onClick={() => setShowCityList(true)}
                                />
                                {showCityList && (
                                    <motion.div
                                        className="absolute top-24 z-50 left-0 w-full bg-white text-black rounded-lg shadow-md overflow-y-auto max-h-80"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {cities.map((city, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 text-left hover:bg-gray-100"
                                            >
                                                {city}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                                {showCityList && (
                                    <AiOutlineClose
                                        className="absolute right-3 top-8 text-gray-400 cursor-pointer"
                                        onClick={() => setShowCityList(false)}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Custom;
