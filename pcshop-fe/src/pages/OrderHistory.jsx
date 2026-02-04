import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (err) {
            setError("Failed to load orders. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow container-custom mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Order History</h1>

                {loading && <div className="text-center py-10">Loading orders...</div>}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                        <a href="/products" className="text-primary font-bold hover:underline">Start Shopping</a>
                    </div>
                )}

                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <span className="font-bold text-gray-700">Order #{order.id}</span>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="font-bold text-primary">
                                    {order.totalPrice?.toLocaleString()} ₫
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            {order.paymentMethod || 'COD'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 text-right">
                                        <div className="font-bold">{order.fullName || 'User'}</div>
                                        <div>{order.shippingAddress || 'No Address'}</div>
                                        <div className="text-xs text-gray-400">{order.phoneNumber}</div>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-gray-100 pt-4">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                                <img src={item.product?.imageUrl || "https://via.placeholder.com/64"} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-medium text-gray-900">{item.product?.name || "Product"}</h4>
                                                <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                            </div>
                                            <div className="text-right font-medium text-gray-900">
                                                {item.price?.toLocaleString()} ₫
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
