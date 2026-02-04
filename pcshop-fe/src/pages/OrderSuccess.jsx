import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OrderSuccess() {
    return (
        <div className="bg-background min-h-screen font-sans flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center container-custom mx-auto px-4 py-20">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center border border-gray-100">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
                    <p className="text-gray-500 mb-8">
                        Thank you for your purchase. Your order has been placed successfully and is being processed.
                    </p>

                    <div className="space-y-3">
                        <Link to="/orders" className="block w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl">
                            View Order History
                        </Link>

                        <Link to="/" className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl transition-all border border-gray-200">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
