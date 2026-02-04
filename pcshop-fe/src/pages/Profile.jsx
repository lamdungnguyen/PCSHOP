import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "../services/userService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || "",
                email: user.email || "", // Assuming user object has email
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        setLoading(true);
        try {
            const updatePayload = {
                username: formData.username,
                email: formData.email,
            };
            if (formData.password) {
                updatePayload.password = formData.password;
            }

            const updatedUser = await updateUser(user.id, updatePayload);

            // Update local context
            login({ ...user, ...updatedUser }); // Merge old user data with new

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Failed to update profile. Try again." });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center mt-20">Please log in to view this page.</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 container-custom mx-auto py-10 px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-primary px-6 py-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-white">My Profile</h1>
                        <p className="text-red-100 text-sm">Manage your account settings</p>
                    </div>

                    <div className="p-6 md:p-8">
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Avatar Section (Placeholder) */}
                                <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-4xl border-4 border-white shadow-md">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <button type="button" className="text-sm text-primary hover:underline font-medium">
                                        Change Avatar
                                    </button>
                                </div>

                                {/* Form Section */}
                                <div className="w-full md:w-2/3 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 mt-4">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Leave blank to keep current"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="Confirm new password"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary hover:bg-red-700 text-white px-8 py-2.5 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
