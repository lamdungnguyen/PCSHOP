import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (err) {
            setError("Failed to load orders.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (!window.confirm(`Change order #${id} status to ${newStatus}?`)) return;

        try {
            await updateOrderStatus(id, newStatus);
            // Refresh local state
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading orders...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Order Management</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-700">Order ID</th>
                            <th className="px-6 py-4 font-bold text-gray-700">Customer</th>
                            <th className="px-6 py-4 font-bold text-gray-700">Date</th>
                            <th className="px-6 py-4 font-bold text-gray-700">Total</th>
                            <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-bold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-primary">#{order.id}</td>
                                <td className="px-6 py-4">
                                    <div className="font-bold">{order.fullName || 'Guest'}</div>
                                    <div className="text-xs text-gray-500">{order.phoneNumber}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-bold">
                                    {order.totalPrice?.toLocaleString()} ₫
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                        >
                                            View
                                        </button>

                                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                                >
                                                    Complete
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        No orders found.
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold">Order Details #{selectedOrder.id}</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Customer Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                        <p><span className="font-semibold">Name:</span> {selectedOrder.fullName}</p>
                                        <p><span className="font-semibold">Phone:</span> {selectedOrder.phoneNumber}</p>
                                        <p><span className="font-semibold">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Shipping Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                        <p><span className="font-semibold">Address:</span> {selectedOrder.shippingAddress}</p>
                                        <p><span className="font-semibold">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                                        <p><span className="font-semibold">Note:</span> {selectedOrder.note || 'None'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Order Items</h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left">Product</th>
                                                <th className="px-4 py-3 text-center">Price</th>
                                                <th className="px-4 py-3 text-center">Quantity</th>
                                                <th className="px-4 py-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedOrder.items?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                                                <img
                                                                    src={item.product?.imageUrl || 'https://via.placeholder.com/40'}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="font-medium text-gray-900 line-clamp-1">{item.product?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">{item.price?.toLocaleString()} ₫</td>
                                                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right font-bold">
                                                        {(item.price * item.quantity).toLocaleString()} ₫
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
                                            <tr>
                                                <td colSpan="3" className="px-4 py-3 text-right">Total Amount:</td>
                                                <td className="px-4 py-3 text-right text-primary text-lg">
                                                    {selectedOrder.totalPrice?.toLocaleString()} ₫
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 sticky bottom-0 rounded-b-xl">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                Close
                            </button>
                            {selectedOrder.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedOrder.id, 'CANCELLED')}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                    >
                                        Cancel Order
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedOrder.id, 'COMPLETED')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                    >
                                        Mark as Completed
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

