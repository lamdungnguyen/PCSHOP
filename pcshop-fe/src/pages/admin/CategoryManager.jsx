import React, { useEffect, useState } from 'react';
import { getCategories } from '../../services/productService';

const API_URL = "http://localhost:8080/api/categories";

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [parentId, setParentId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const payload = {
            name: newCategoryName,
            parent: parentId ? { id: parentId } : null
        };

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setNewCategoryName("");
                setParentId("");
                loadCategories(); // Refresh list
                alert("Category created!");
            } else {
                alert("Failed to create category");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating category");
        }
    };

    // Helper to render categories recursively (flat list for now for table, but need logic for display)
    // For simplicity, we just list them flat.

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Category Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Create Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h2 className="text-lg font-bold mb-4">Add Category</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                placeholder="e.g. Laptops"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (Optional)</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2"
                                value={parentId}
                                onChange={e => setParentId(e.target.value)}
                            >
                                <option value="">-- None (Root) --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors"
                        >
                            Create Category
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700">ID</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Name</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Parent</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-500">#{cat.id}</td>
                                    <td className="px-6 py-4 font-bold">{cat.name}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {cat.parent ? cat.parent.name : <span className="text-gray-300">-</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Future: Edit/Delete */}
                                        <span className="text-gray-400 text-xs">Edit</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
