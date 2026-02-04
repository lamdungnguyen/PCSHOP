import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans flex text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <div className="text-2xl font-bold tracking-tighter">PCSHOP <span className="text-xs font-normal text-gray-400 block tracking-normal">Admin Panel</span></div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block px-4 py-3 bg-primary rounded-lg font-medium">Dashboard</Link>
                    <Link to="/admin/products" className="block px-4 py-3 hover:bg-white/10 rounded-lg font-medium transition-colors">Products</Link>
                    <Link to="/admin/orders" className="block px-4 py-3 hover:bg-white/10 rounded-lg font-medium transition-colors">Orders</Link>
                    <Link to="/admin/users" className="block px-4 py-3 hover:bg-white/10 rounded-lg font-medium transition-colors">Users</Link>
                    <Link to="/admin/banners" className="block px-4 py-3 hover:bg-white/10 rounded-lg font-medium transition-colors">Banners</Link>
                    <Link to="/admin/settings" className="block px-4 py-3 hover:bg-white/10 rounded-lg font-medium transition-colors">Settings</Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Link to="/" className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-full px-4 font-medium">
                        <span>Exit Admin</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="font-bold text-lg md:hidden">PCSHOP Admin</div>
                    <div className="text-sm font-medium text-gray-500">Welcome, Administrator</div>
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                </header>

                {/* Scrollable Area */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
