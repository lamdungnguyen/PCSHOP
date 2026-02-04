import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    // Calculate total safely
    const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

    return (
        <div className="bg-background min-h-screen font-sans">
            <Navbar />

            <div className="container-custom mx-auto pt-8 pb-20">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    Your Cart
                    <span className="text-lg font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{cartItems.length} items</span>
                </h1>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                                    <img src={item.imageUrl || item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-lg text-primary mb-1">{item.name}</h3>
                                    <p className="text-sm text-green-600 font-medium">In Stock</p>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-1 border border-gray-200">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-bold"
                                    >-</button>
                                    <span className="w-8 text-center font-bold bg-white">{item.qty}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-bold"
                                    >+</button>
                                </div>

                                <div className="text-right min-w-[120px]">
                                    <div className="font-bold text-red-600 text-lg">{(item.price * item.qty).toLocaleString()} ₫</div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-xs text-gray-400 hover:text-red-500 underline mt-1"
                                    >Remove</button>
                                </div>
                            </div>
                        ))}

                        {cartItems.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">Your cart is empty.</p>
                                <Link to="/" className="text-primary font-bold hover:underline mt-2 inline-block">Start Shopping</Link>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 h-fit">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-24">
                            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{total.toLocaleString()} ₫</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>Included</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold mb-8 pt-4 border-t border-gray-100">
                                <span>Total</span>
                                <span className="text-red-600">{total.toLocaleString()} ₫</span>
                            </div>

                            <Link to="/checkout" className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-red-500/30 transition-all uppercase tracking-wider mb-3 text-center">
                                Checkout Now
                            </Link>
                            <p className="text-xs text-center text-gray-500">
                                Secure Checkout - 100% Guaranteed
                            </p>
                        </div>

                        {/* Promo Code Mock */}
                        <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200">
                            <div className="text-sm font-bold mb-2">Have a promo code?</div>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Enter code" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Apply</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
