import React, { useState, useEffect } from 'react';

export default function HomeBanner({ banners = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide logic
    useEffect(() => {
        if (!banners || banners.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners]);

    if (!banners || banners.length === 0) {
        return (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg animate-pulse">
                <p className="text-gray-400 font-bold">Loading Banners...</p>
            </div>
        );
    }

    const nextSlide = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="w-full h-full relative group cursor-pointer overflow-hidden rounded-lg bg-gray-200">
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <img
                        src={banner.imageUrl}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                    {/* Optional Caption Overlay */}
                    {/* 
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                        <div className="transform transition-transform duration-500 translate-y-0">
                            <h2 className="text-white text-4xl font-bold mb-2 drop-shadow-md">{banner.link ? "Click to View" : ""}</h2>
                        </div>
                    </div> 
                    */}
                </div>
            ))}

            {/* Navigation Buttons */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentSlide(idx);
                                }}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? "bg-red-600 w-8" : "bg-white/50 hover:bg-white"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
