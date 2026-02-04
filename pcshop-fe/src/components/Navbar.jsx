import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { getCategories } from '../services/productService';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = () => {
        let url = `/products?q=${encodeURIComponent(searchQuery)}`;
        if (selectedCategory) {
            url += `&category=${selectedCategory}`;
        }
        navigate(url);
    };

    return (
        <header className="w-full font-sans">
            {/* Top Bar - Optional for "Support/Contact" */}
            <div className="bg-white text-xs border-b border-gray-200">
                <div className="container-custom mx-auto h-8 flex justify-end items-center gap-4 text-gray-500">
                    <a href="#" className="hover:text-red-600 transition-colors">Showroom System</a>
                    <a href="#" className="hover:text-red-600 transition-colors">Video</a>
                    <Link to="/news" className="hover:text-red-600 transition-colors">News</Link>
                    <Link to="/orders" className="hover:text-red-600 transition-colors">Order Check</Link>
                </div>
            </div>

            {/* Main Header - Black Background */}
            <div className="bg-primary text-white sticky top-0 z-50 shadow-md">
                <div className="container-custom mx-auto h-20 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="h-10 w-10 bg-yellow-400 rounded-lg flex items-center justify-center text-primary font-bold text-xl">P</div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold leading-none tracking-tight">PCSHOP</span>
                            <span className="text-[10px] text-gray-400 leading-none">HIGH-END PC & GAMING GEAR</span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl relative hidden md:block">
                        <div className="flex">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-white text-black px-3 py-2 rounded-l-md text-sm border-r border-gray-300 focus:outline-none cursor-pointer max-w-[150px]"
                            >
                                <option value="">All Categories</option>
                                {categories
                                    .filter(cat => !cat.parent)
                                    .map(parent => (
                                        <optgroup key={parent.id} label={parent.name}>
                                            <option value={parent.id}>{parent.name} (All)</option>
                                            {parent.children && parent.children.map(child => (
                                                <option key={child.id} value={child.id}>&nbsp;&nbsp;{child.name}</option>
                                            ))}
                                        </optgroup>
                                    ))
                                }
                            </select>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search for products..."
                                className="w-full px-4 py-2 text-black text-sm focus:outline-none"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-white text-black px-4 py-2 rounded-r-md hover:bg-gray-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-8 text-xs font-medium">
                        <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                            </svg>
                            <div className="hidden lg:block">
                                <div>Hotline</div>
                                <div className="font-bold text-sm">090 456 0681</div>
                            </div>
                        </div>

                        {user ? (
                            <div className="relative">
                                <div
                                    className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    <div className="hidden lg:block">
                                        <div>Welcome</div>
                                        <div className="font-bold text-sm truncate max-w-[100px]">{user.username}</div>
                                    </div>
                                </div>

                                {showProfileMenu && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                        {(user.role === 'ADMIN') && (
                                            <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 font-medium">Admin Dashboard</Link>
                                        )}
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                                        <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Order History</Link>
                                        <div className="border-t border-gray-100"></div>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-medium">Sign Out</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <div className="hidden lg:block">
                                    <div>Account</div>
                                    <div className="font-bold text-sm">Sign In</div>
                                </div>
                            </Link>
                        )}

                        <Link to="/cart" className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors relative">
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                {totalItems > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{totalItems}</div>
                                )}
                            </div>
                            <div className="hidden lg:block">
                                <div>Cart</div>
                                <div className="font-bold text-sm">{totalItems > 0 ? `${totalItems} Items` : 'Empty'}</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Links Bar */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container-custom mx-auto h-12 flex items-center gap-8 overflow-x-auto text-sm font-medium">
                    <Link to="/products" className="flex items-center gap-2 text-red-600 font-bold uppercase whitespace-nowrap">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        Product Catalog
                    </Link>
                    {["Gaming PC", "Workstation", "Office PC", "Apple", "Laptops", "Monitors", "Components"].map((item) => (
                        <Link key={item} to="/products" className="whitespace-nowrap hover:text-red-600 transition-colors">{item}</Link>
                    ))}
                    <Link to="/build-pc" className="ml-auto text-red-600 font-bold whitespace-nowrap hover:underline">Build PC Tool</Link>
                </div>
            </div>
        </header>
    );
}
