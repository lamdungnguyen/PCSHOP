import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    const getLinkClass = (path) => `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(path) ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`;

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <div className="text-2xl font-bold tracking-tighter">PCSHOP <span className="text-xs font-normal text-gray-400 block tracking-normal">Admin Panel</span></div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className={getLinkClass('/admin')}>Dashboard</Link>
                    <Link to="/admin/products" className={getLinkClass('/admin/products')}>Products</Link>
                    <Link to="/admin/orders" className={getLinkClass('/admin/orders')}>Orders</Link>
                    <Link to="/admin/users" className={getLinkClass('/admin/users')}>Users</Link>
                    <Link to="/admin/banners" className={getLinkClass('/admin/banners')}>Banners</Link>
                    <Link to="/admin/news" className={getLinkClass('/admin/news')}>News</Link>
                    <Link to="/admin/categories" className={getLinkClass('/admin/categories')}>Categories</Link>
                    <Link to="/admin/settings" className={getLinkClass('/admin/settings')}>Settings</Link>
                </nav>


            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                {/* Top Header */}
                <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="font-bold text-lg md:hidden">PCSHOP Admin</div>

                    <div className="flex items-center gap-6 ml-auto">
                        <Link to="/" className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100">
                            Exit Admin
                        </Link>

                        <div className="h-8 w-px bg-gray-200"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-gray-800">Administrator</div>
                                <div className="text-xs text-gray-500">Super Admin</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=Admin&background=000&color=fff`} alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
