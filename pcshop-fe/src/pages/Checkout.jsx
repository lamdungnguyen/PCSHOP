import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        city: 'Ha Noi',
        note: '',
        paymentMethod: 'COD'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
    const total = subtotal; // Add shipping logic if needed

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        if (!formData.fullName || !formData.phoneNumber || !formData.address) {
            setError("Please fill in all required shipping fields.");
            window.scrollTo(0, 0);
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Prepare items map
            const itemsMap = {};
            cartItems.forEach(item => {
                itemsMap[item.id] = item.qty;
            });

            const payload = {
                items: itemsMap,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                shippingAddress: `${formData.address}, ${formData.city}`,
                paymentMethod: formData.paymentMethod,
                note: formData.note
            };

            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to place order.");
            }

            // Success
            clearCart();
            // alert("Order placed successfully!");
            navigate('/order-success');

        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-background min-h-screen font-sans">
                <Navbar />
                <div className="container-custom mx-auto py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-2 rounded-lg">
                        Continue Shopping
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen font-sans">
            <Navbar />

            <div className="container-custom mx-auto pt-8 pb-20">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Shipping Info */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                                Shipping Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City / Province</label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                                    >
                                        <option value="Ha Noi">Ha Noi</option>
                                        <option value="Ho Chi Minh">Ho Chi Minh</option>
                                        <option value="Da Nang">Da Nang</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Note</label>
                                    <input
                                        type="text"
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-primary ${formData.paymentMethod === 'COD' ? 'bg-gray-50 border-primary' : 'bg-white border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === 'COD'}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-primary"
                                    />
                                    <span className="font-bold">COD (Cash on Delivery)</span>
                                </label>
                                <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-primary ${formData.paymentMethod === 'BANK' ? 'bg-gray-50 border-primary' : 'bg-white border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="BANK"
                                        checked={formData.paymentMethod === 'BANK'}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-primary"
                                    />
                                    <span className="font-bold">Bank Transfer (QR Code)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-4 h-fit">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-24">
                            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Your Order</h2>

                            {/* Item List */}
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                                            <img src={item.imageUrl || item.image} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold line-clamp-1">{item.name}</div>
                                            <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                                        </div>
                                        <div className="text-sm font-bold">{(item.price * item.qty).toLocaleString()}₫</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>{subtotal.toLocaleString()} ₫</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold mb-8 text-red-600">
                                <span>Total</span>
                                <span>{total.toLocaleString()} ₫</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all uppercase tracking-wider ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:shadow-xl'}`}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
