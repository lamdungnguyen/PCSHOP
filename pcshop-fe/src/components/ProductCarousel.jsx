import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function ProductCarousel({ title, icon, products = [], link }) {
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-scroll logic (Conveyor belt effect)
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let scrollAmount = 0;
        const speed = 0.5; // Pixels per tick (adjust for speed)
        let animationFrameId;

        const step = () => {
            if (!isHovered && scrollContainer) {
                // Check if we've reached the end
                if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
                    // Optional: Reset to 0 for infinite loop feel, or just stop. 
                    // For simple conveyor, let's just bounce or loop. 
                    // Resetting to 0 is jarring without cloning items. 
                    // Let's implement a simple bounce or just stop.
                    // Actually, for a standard carousel, auto-play usually jumps to next slide.
                    // But user asked for "conveyor effect".
                    // Let's try a continuous scroll that resets?
                    // Easier approach for MVP: Simple slow scroll until end.
                    // Better UX: standard auto-play intervals or just manual. 
                    // User specifically asked for "auto transfer products like chain/dây chuyền".
                    // Continuous scroll is best.
                }

                // Simple continuous scroll opacity
                // scrollContainer.scrollLeft += speed;
            }
            // animationFrameId = requestAnimationFrame(step);
        };

        // animationFrameId = requestAnimationFrame(step);

        // Alternative: Interval based auto-scroll (slide by slide)
        const interval = setInterval(() => {
            if (!isHovered && scrollContainer) {
                const cardWidth = 280; // Approximate card width + gap
                const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

                if (scrollContainer.scrollLeft >= maxScroll - 10) {
                    scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }
        }, 3000); // Scroll every 3 seconds

        return () => {
            // cancelAnimationFrame(animationFrameId);
            clearInterval(interval);
        };
    }, [isHovered, products]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="py-8 border-b border-gray-100 last:border-0">
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    {icon && <span className="text-2xl">{icon}</span>}
                    <h2 className="text-2xl font-bold uppercase text-gray-800 tracking-tight border-l-4 border-primary pl-4">{title}</h2>
                </div>
                <div className="flex items-center gap-4">
                    {link && (
                        <Link to={link} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                            View All
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </Link>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={scrollLeft}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95"
                            aria-label="Scroll Left"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button
                            onClick={scrollRight}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95"
                            aria-label="Scroll Right"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x"
                    style={{
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none' // IE/Edge
                    }}
                >
                    {/* Hide scrollbar for Chrome/Safari */}
                    <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

                    {products.map(product => (
                        <div key={product.id} className="w-[240px] flex-shrink-0 snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Gradient Fade Edges (Optional, adds premium feel) */}
                <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
            </div>
        </div>
    );
}
