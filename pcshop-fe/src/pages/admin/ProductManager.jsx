import { useEffect, useState } from "react";
import { getAllProducts, createProduct, updateProduct, deleteProduct, getCategories, createCategory } from "../../services/productService";
import { uploadImage } from "../../services/uploadService";

export default function ProductManager() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        quantity: "",
        imageUrl: "",
        images: [], // List of secondary images { id, imageUrl } or just strings
        categoryId: "",
        description: "",
        parentCategoryId: "" // For UI state only
    });

    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryParentId, setNewCategoryParentId] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setError(null);
            const [productsData, categoriesData] = await Promise.all([
                getAllProducts(),
                getCategories()
            ]);
            setProducts(productsData.sort((a, b) => b.id - a.id));
            setCategories(categoriesData);
        } catch (error) {
            console.error(error);
            setError("Cannot connect to server.");
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        const category = product.category;
        const parentId = category?.parent?.id || (category?.id && !category.parent ? category.id : "") || "";

        // If parentId is valid, set categoryId. If the current category is a parent, logic differs.
        // Current logic: We want to show "Parent" selected. 
        // If product is in "Laptop" (Parent) -> parentId="Laptop". categoryId could be empty or same?
        // Let's rely on user to re-select if needed, but try to populate.

        setFormData({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            imageUrl: product.imageUrl,
            images: product.images ? product.images.map(img => img.imageUrl) : [],
            description: product.description || "",
            categoryId: category?.id || "",
            parentCategoryId: parentId ? parentId.toString() : ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                loadData();
            } catch (err) {
                alert("Failed to delete product");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoryId) {
            alert("Please select a category.");
            return;
        }

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            imageUrl: formData.imageUrl,
            description: formData.description,
            category: { id: parseInt(formData.categoryId) },
            images: formData.images.map(img => ({ imageUrl: img }))
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, payload);
            } else {
                await createProduct(payload);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            resetForm();
            loadData();
        } catch (err) {
            console.error(err);
            alert("Failed to save product: " + err.message);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: newCategoryName,
                parent: newCategoryParentId ? { id: newCategoryParentId } : null
            };
            await createCategory(payload);
            setIsCategoryModalOpen(false);
            setNewCategoryName("");
            setNewCategoryParentId("");
            const updatedCategories = await getCategories();
            setCategories(updatedCategories);
            alert("Category created!");
        } catch (err) {
            alert("Failed to create category");
        }
    };

    const resetForm = () => {
        setFormData({ name: "", price: "", quantity: "", imageUrl: "", images: [], categoryId: "", description: "", parentCategoryId: "" });
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        resetForm();
        setIsModalOpen(true);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file) => {
        setUploading(true);
        try {
            const url = await uploadImage(file);
            const fullUrl = url.startsWith("http") ? url : `http://localhost:8080${url}`;
            setFormData(prev => ({ ...prev, imageUrl: fullUrl }));
        } catch (error) {
            console.error(error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
    };

    const updateImageField = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const removeImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    // Filtered Categories
    const parentCategories = categories.filter(c => !c.parent);

    // Child categories logic:
    // If parent is selected, show children.
    const childCategories = formData.parentCategoryId
        ? categories.filter(c => c.parent?.id === parseInt(formData.parentCategoryId))
        : [];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Product Management</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold text-sm transition-all"
                    >
                        + Add Category
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="bg-primary hover:bg-black text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all"
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 font-medium border border-red-200">
                    ⚠️ {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Qty</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-500">#{p.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                        <img src={p.imageUrl} alt="" className="w-10 h-10 object-cover rounded bg-gray-100" />
                                        {p.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold">
                                            {p.category?.name || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-blue-600 font-bold">
                                        {p.price?.toLocaleString()} ₫
                                    </td>
                                    <td className="px-6 py-4 font-bold">{p.quantity}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline font-medium">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    required
                                />
                            </div>

                            {/* Category Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Parent Category</label>
                                    <select
                                        value={formData.parentCategoryId}
                                        onChange={e => setFormData({ ...formData, parentCategoryId: e.target.value, categoryId: "" })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    >
                                        <option value="">Select Parent</option>
                                        {parentCategories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sub Category</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                        disabled={!formData.parentCategoryId || childCategories.length === 0}
                                    >
                                        <option value="">Select Sub/Target</option>
                                        {childCategories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                        {/* Fallback to show current if valid but not in child list? No, forcing hierarchy is safer */}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Main Image</label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors mb-2 ${dragging ? "border-primary bg-blue-50" : "border-gray-300 hover:border-primary"
                                        }`}
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={handleDrop}
                                >
                                    {formData.imageUrl ? (
                                        <div className="relative inline-block">
                                            <img src={formData.imageUrl} alt="Preview" className="h-32 object-cover rounded shadow-sm" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs shadow"
                                            >✕</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <p className="text-gray-500 text-sm">{uploading ? "Uploading..." : "Drag & Drop Image"}</p>
                                            <label className="text-xs text-primary font-bold cursor-pointer hover:underline">
                                                Browse File
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="Or enter Image URL"
                                />
                            </div>

                            {/* Additional Images */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Additional Images</label>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={img}
                                            onChange={e => updateImageField(idx, e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            placeholder="Secondary Image URL"
                                        />
                                        <button type="button" onClick={() => removeImageField(idx)} className="text-red-500 hover:text-red-700 px-2">✕</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addImageField} className="text-sm text-primary hover:underline font-bold">+ Add Another Image</button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    rows="4"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-black transition-colors">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Add Category</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Parent Category (Optional)</label>
                                <select
                                    value={newCategoryParentId}
                                    onChange={e => setNewCategoryParentId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="">None (Top Level)</option>
                                    {parentCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={e => setNewCategoryName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-black transition-colors">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
