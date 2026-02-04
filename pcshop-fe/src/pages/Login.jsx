import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? 'http://localhost:8080/api/auth/login' : 'http://localhost:8080/api/auth/register';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (isLogin) {
                alert('Login Successful!');
                login(data); // Use auth context
                navigate('/');
            } else {
                alert('Registration Successful! Please Sign In.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen font-sans">
            <Navbar />

            <div className="flex items-center justify-center min-h-[calc(100vh-400px)] pt-32 pb-20 px-4">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-gray-100">
                    {/* Header Tabs */}
                    <div className="flex border-b border-gray-100">
                        <button
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${isLogin ? 'bg-white text-primary border-b-2 border-primary' : 'bg-gray-50 text-gray-400 hover:bg-white'}`}
                            onClick={() => { setIsLogin(true); setError(''); }}
                        >
                            Sign In
                        </button>
                        <button
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${!isLogin ? 'bg-white text-primary border-b-2 border-primary' : 'bg-gray-50 text-gray-400 hover:bg-white'}`}
                            onClick={() => { setIsLogin(false); setError(''); }}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form Container */}
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center mb-2 text-primary">
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </h2>
                        <p className="text-center text-gray-500 mb-8 text-sm">
                            {isLogin ? 'Enter your credentials to access your account' : 'Join us to get exclusive offers and build your dream PC'}
                        </p>

                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200 text-center">{error}</div>}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email (Optional)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="your_username"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {isLogin && (
                                <div className="flex items-center justify-between text-xs">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                                        <span className="text-gray-600">Remember me</span>
                                    </label>
                                    <a href="#" className="font-bold text-primary hover:text-red-500">Forgot Password?</a>
                                </div>
                            )}

                            <button
                                disabled={loading}
                                className="w-full bg-primary hover:bg-black text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 uppercase tracking-wide disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                            </button>
                        </form>

                        {/* Social Login */}
                        <div className="mt-8 text-center">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">Or continue with</span></div>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <a
                                    href="http://localhost:8080/oauth2/authorization/google"
                                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-bold text-blue-600">G</span>
                                </a>

                                <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <span className="font-bold text-blue-800">F</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
