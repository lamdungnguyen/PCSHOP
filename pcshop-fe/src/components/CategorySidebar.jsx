import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

function FlyoutMenu({ children, anchorRef, visible }) {
    const [style, setStyle] = useState({});

    useEffect(() => {
        if (visible && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setStyle({
                position: "fixed",
                top: rect.top,
                left: rect.right,
                width: 256,
                zIndex: 9999,
            });
        }
    }, [visible, anchorRef]);

    if (!visible) return null;

    return createPortal(
        <div style={style} className="bg-white border border-gray-200 shadow-xl rounded-r-lg min-h-full">
            {children}
        </div>,
        document.body
    );
}

function CategoryItem({ parent }) {
    const [hovered, setHovered] = useState(false);
    const rowRef = useRef(null);

    return (
        <div
            ref={rowRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative"
        >
            <Link
                to={`/products?category=${parent.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 hover:text-red-600 transition-colors text-sm font-medium border-b border-gray-50 last:border-0"
            >
                <span>{parent.name}</span>
                {parent.children && parent.children.length > 0 && (
                    <span className="text-gray-400 text-xs">›</span>
                )}
            </Link>

            {parent.children && parent.children.length > 0 && (
                <FlyoutMenu anchorRef={rowRef} visible={hovered}>
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
                </FlyoutMenu>
            )}
        </div>
    );
}

export default function CategorySidebar({ categories }) {
    const rootCategories = categories.filter(c => !c.parent);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
            <div className="bg-primary text-white p-3 font-bold text-sm uppercase flex items-center gap-2 rounded-t-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                Product Categories
            </div>

            <div className="flex flex-col py-2">
                {rootCategories.map((parent) => (
                    <CategoryItem key={parent.id} parent={parent} />
                ))}
                {rootCategories.length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                )}
            </div>
        </div>
    );
}
