import { Link } from "react-router-dom";

export default function CategorySidebar({ categories }) {
    // Filter for root categories
    const rootCategories = categories.filter(c => !c.parent);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-visible h-full flex flex-col relative z-20">
            <div className="bg-primary text-white p-3 font-bold text-sm uppercase flex items-center gap-2 rounded-t-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                Product Categories
            </div>

            <div className="flex flex-col py-2 relative">
                {rootCategories.map((parent) => (
                    <div key={parent.id} className="group static md:relative">
                        {/* Parent Link */}
                        <Link
                            to={`/products?category=${parent.id}`}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 hover:text-red-600 transition-colors text-sm font-medium border-b border-gray-50 last:border-0"
                        >
                            <span className="flex items-center gap-2">
                                {/* Icon placeholder or logic if available */}
                                {parent.name}
                            </span>
                            {parent.children && parent.children.length > 0 && (
                                <span className="text-gray-400 text-xs">›</span>
                            )}
                        </Link>

                        {/* Flyout Submenu */}
                        {parent.children && parent.children.length > 0 && (
                            <div className="hidden group-hover:block absolute left-full top-0 w-64 bg-white border border-gray-200 shadow-xl rounded-r-lg z-50 min-h-full">
                                <div className="p-2">
                                    <div className="font-bold text-xs uppercase text-gray-400 px-3 py-2 border-b border-gray-100 mb-1">
                                        {parent.name}
                                    </div>
                                    {parent.children.map(child => (
                                        <Link
                                            key={child.id}
                                            to={`/products?category=${child.id}`}
                                            className="block px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded transition-colors"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {rootCategories.length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                )}
            </div>
        </div>
    );
}
