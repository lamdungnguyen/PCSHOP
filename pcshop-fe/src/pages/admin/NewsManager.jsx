import React, { useEffect, useState } from 'react';
import { getAllNews, createNews, updateNews, deleteNews } from '../../services/newsService';

export default function NewsManager() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        imageUrl: "",
        author: "Admin"
    });

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await getAllNews();
            setNewsList(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateNews(currentId, formData);
                alert("News updated successfully!");
            } else {
                await createNews(formData);
                alert("News created successfully!");
            }
            resetForm();
            loadNews();
        } catch (error) {
            console.error(error);
            alert("Failed to save news.");
        }
    };

    const handleEdit = (news) => {
        setIsEditing(true);
        setCurrentId(news.id);
        setFormData({
            title: news.title,
            content: news.content,
            imageUrl: news.imageUrl || "",
            author: news.author
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this news?")) {
            try {
                await deleteNews(id);
                loadNews();
            } catch (error) {
                console.error(error);
                alert("Failed to delete news.");
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            title: "",
            content: "",
            imageUrl: "",
            author: "Admin"
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">News Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200 h-fit">
                    <h2 className="text-lg font-bold mb-4">{isEditing ? "Edit News" : "Create News"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                placeholder="http://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary-hover"
                            >
                                {isEditing ? "Update" : "Create"}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700">ID</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Title</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Author</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {newsList.map(news => (
                                <tr key={news.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-500">#{news.id}</td>
                                    <td className="px-6 py-4 font-bold truncate max-w-xs">{news.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{news.author}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => handleEdit(news)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(news.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {newsList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No news articles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
