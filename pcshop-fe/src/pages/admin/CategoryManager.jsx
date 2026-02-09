import React, { useEffect, useState } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [parentId, setParentId] = useState("");

    // Edit State
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState("");
    const [editParentId, setEditParentId] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createCategory({
                name: newCategoryName,
                parent: parentId ? { id: parentId } : null
            });
            setNewCategoryName("");
            setParentId("");
            loadCategories();
            alert("Category created!");
        } catch (err) {
            console.error(err);
            alert("Error creating category");
        }
    };

    const handleEditClick = (cat) => {
        setEditingCategory(cat);
        setEditName(cat.name);
        setEditParentId(cat.parent ? cat.parent.id : "");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateCategory(editingCategory.id, {
                name: editName,
                parent: editParentId ? { id: editParentId } : null
            });
            setEditingCategory(null);
            loadCategories();
            alert("Category updated!");
        } catch (err) {
            console.error(err);
            alert("Error updating category");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id);
            loadCategories();
        } catch (err) {
            console.error(err);
            alert("Error deleting category");
        }
    };

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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
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
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => handleEditClick(cat)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal (Simple implementation) */}
            {editingCategory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Category</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={editParentId}
                                    onChange={e => setEditParentId(e.target.value)}
                                >
                                    <option value="">-- None (Root) --</option>
                                    {categories
                                        .filter(c => c.id !== editingCategory.id) // Prevent self-parenting
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
