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
    const [activeTab, setActiveTab] = useState("general"); // general | variants
    const [searchTerm, setSearchTerm] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        price: "", // Base/Display Price
        quantity: "", // Total Quantity (calculated or manual)
        wattage: "", // Wattage for PC Builder
        imageUrl: "",
        images: [],
        categoryId: "",
        description: "",
        parentCategoryId: "",
        specifications: [], // Array of { key: "", value: "" }
        variants: [] // Array of { color, specifications: "", price: "", stockQuantity: "", imageUrl: "" }
    });

    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryParentId, setNewCategoryParentId] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const parseSpecs = (specsString) => {
        if (!specsString) return [];
        try {
            const parsed = JSON.parse(specsString);
            if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                // Handle legacy object format if any, or just array
                return Object.entries(parsed).map(([key, value]) => ({ key, value }));
            }
            if (Array.isArray(parsed)) return parsed;
            return [{ key: "General", value: specsString }]; // Fallback for plain text
        } catch (e) {
            return [{ key: "General", value: specsString }]; // Fallback for plain text
        }
    };

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

        setFormData({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            wattage: product.wattage || "",
            imageUrl: product.imageUrl,
            images: product.images ? product.images.map(img => img.imageUrl) : [],
            description: product.description || "",
            categoryId: category?.id || "",
            parentCategoryId: parentId ? parentId.toString() : "",
            specifications: parseSpecs(product.specifications),
            variants: product.variants || []
        });
        setActiveTab("general");
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

        // Calculate total quantity from variants if variants exist
        let totalQty = parseInt(formData.quantity) || 0;
        if (formData.variants.length > 0) {
            totalQty = formData.variants.reduce((sum, v) => sum + (parseInt(v.stockQuantity) || 0), 0);
        }

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            quantity: totalQty,
            wattage: parseInt(formData.wattage) || 0,
            imageUrl: formData.imageUrl,
            description: formData.description,
            category: { id: parseInt(formData.categoryId) },
            images: formData.images.map(img => ({ imageUrl: img })),
            specifications: JSON.stringify(formData.specifications), // Convert back to string
            variants: formData.variants.map(v => ({
                ...v,
                price: parseFloat(v.price),
                stockQuantity: parseInt(v.stockQuantity)
            }))
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
        setFormData({
            name: "", price: "", quantity: "", wattage: "", imageUrl: "", images: [],
            categoryId: "", description: "", parentCategoryId: "",
            specifications: [], variants: []
        });
        setActiveTab("general");
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

    // Variant Handlers
    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { color: "", specifications: "", price: formData.price, stockQuantity: 0, imageUrl: "" }]
        });
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData({ ...formData, variants: newVariants });
    };

    const removeVariant = (index) => {
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: newVariants });
    };

    // Filtered Categories
    const parentCategories = categories.filter(c => !c.parent);
    const childCategories = formData.parentCategoryId
        ? categories.filter(c => c.parent?.id === parseInt(formData.parentCategoryId))
        : [];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Product Management</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-black outline-none w-64"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
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
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.filter(p =>
                                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.id.toString().includes(searchTerm)
                            ).map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-500">#{p.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                        <img src={p.imageUrl} alt="" className="w-10 h-10 object-cover rounded bg-gray-100" />
                                        <div>
                                            {p.name}
                                            {p.variants?.length > 0 && (
                                                <div className="text-xs text-gray-400 mt-1">{p.variants.length} Variants</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold">
                                            {p.category?.name || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-blue-600 font-bold">
                                        {p.price?.toLocaleString()} ₫
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {p.quantity}
                                    </td>
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                            <div>
                                <h3 className="font-bold text-2xl text-gray-800">{editingProduct ? "Edit Product" : "New Product"}</h3>
                                <p className="text-sm text-gray-400">Fill in the information below to {editingProduct ? "update" : "create"} a product.</p>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-shadow font-bold shadow-lg ring-4 ring-gray-100">
                                    {editingProduct ? "Update Product" : "Create Product"}
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 px-8 bg-gray-50/50">
                            <button
                                type="button"
                                className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${activeTab === 'general' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('general')}
                            >
                                General Information
                            </button>
                            <button
                                type="button"
                                className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${activeTab === 'variants' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('variants')}
                            >
                                Variants & Stock ({formData.variants.length})
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                            {activeTab === 'general' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* LEFT COLUMN (2/3) */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Basic Details Card */}
                                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">01</span>
                                                Basic Details
                                            </h4>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                        placeholder="e.g. Gaming Laptop X1"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Base Price (₫)</label>
                                                        <input
                                                            type="number"
                                                            value={formData.price}
                                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Total Stock</label>
                                                        <input
                                                            type="number"
                                                            value={formData.variants.length > 0 ? formData.variants.reduce((sum, v) => sum + (parseInt(v.stockQuantity) || 0), 0) : formData.quantity}
                                                            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                                            className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none ${formData.variants.length > 0 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                                                            disabled={formData.variants.length > 0}
                                                            placeholder="0"
                                                        />
                                                        {formData.variants.length > 0 && <p className="text-xs text-blue-600 mt-1 font-medium">Auto-calculated from variants</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Wattage (W)</label>
                                                        <input
                                                            type="number"
                                                            value={formData.wattage || ""}
                                                            onChange={e => setFormData({ ...formData, wattage: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                            placeholder="e.g. 65"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                                    <textarea
                                                        value={formData.description}
                                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                        rows="6"
                                                        placeholder="Describe the product..."
                                                    />
                                                </div>
                                            </div>
                                        </section>

                                        {/* Specifications Card */}
                                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                                                <span className="bg-purple-100 text-purple-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">02</span>
                                                Technical Specifications
                                            </h4>

                                            <div className="space-y-3">
                                                {formData.specifications.map((spec, idx) => (
                                                    <div key={idx} className="flex gap-4 items-center group">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Key (e.g. CPU)"
                                                                value={spec.key}
                                                                onChange={(e) => {
                                                                    const newSpecs = [...formData.specifications];
                                                                    newSpecs[idx].key = e.target.value;
                                                                    setFormData({ ...formData, specifications: newSpecs });
                                                                }}
                                                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-300 rounded-lg px-3 py-2 text-sm transition-all outline-none font-medium"
                                                            />
                                                        </div>
                                                        <span className="text-gray-300">:</span>
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Value (e.g. Intel Core i9)"
                                                                value={spec.value}
                                                                onChange={(e) => {
                                                                    const newSpecs = [...formData.specifications];
                                                                    newSpecs[idx].value = e.target.value;
                                                                    setFormData({ ...formData, specifications: newSpecs });
                                                                }}
                                                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-300 rounded-lg px-3 py-2 text-sm transition-all outline-none"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newSpecs = formData.specifications.filter((_, i) => i !== idx);
                                                                setFormData({ ...formData, specifications: newSpecs });
                                                            }}
                                                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, specifications: [...formData.specifications, { key: "", value: "" }] })}
                                                    className="mt-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 font-bold hover:border-black hover:text-black transition-all flex items-center justify-center gap-2"
                                                >
                                                    <span>+ Add Specification</span>
                                                </button>
                                            </div>
                                        </section>
                                    </div>

                                    {/* RIGHT COLUMN (1/3) */}
                                    <div className="space-y-8">
                                        {/* Organization Card */}
                                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                            <h4 className="font-bold text-md mb-4 text-gray-800">Organization</h4>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parent Category</label>
                                                    <select
                                                        value={formData.parentCategoryId}
                                                        onChange={e => setFormData({ ...formData, parentCategoryId: e.target.value, categoryId: "" })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                                                    >
                                                        <option value="">Select Parent</option>
                                                        {parentCategories.map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub Category</label>
                                                    <select
                                                        value={formData.categoryId}
                                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                                                    >
                                                        <option value="">Select Sub/Target</option>
                                                        {childCategories.map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Media Card */}
                                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                                            <h4 className="font-bold text-md mb-4 text-gray-800 text-left">Media Gallery</h4>

                                            {/* Main Image */}
                                            <div className="mb-6">
                                                <label className="block text-xs font-bold text-gray-400 text-left mb-2 uppercase tracking-wider">Main Image</label>
                                                <div
                                                    className={`aspect-video w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden bg-gray-50 ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                                    onDragLeave={() => setDragging(false)}
                                                    onDrop={handleDrop}
                                                >
                                                    {formData.imageUrl ? (
                                                        <>
                                                            <img src={formData.imageUrl} className="w-full h-full object-contain p-2" alt="Main" />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, imageUrl: "" }); }}
                                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-10"
                                                            >✕</button>
                                                        </>
                                                    ) : (
                                                        <div className="text-gray-400 relative z-0 pointer-events-none">
                                                            <div className="text-4xl mb-2">📷</div>
                                                            <p className="text-sm font-semibold">{uploading ? 'Uploading...' : 'Drag Main Image Here'}</p>
                                                        </div>
                                                    )}

                                                    <label className="absolute inset-0 cursor-pointer">
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0])} />
                                                    </label>
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder="Or paste image URL"
                                                    value={formData.imageUrl}
                                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                    className="w-full mt-2 text-xs border-b border-gray-200 py-1 focus:border-black outline-none text-gray-600"
                                                />
                                            </div>

                                            {/* Gallery */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 text-left mb-2 uppercase tracking-wider">Additional Images</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {formData.images.map((img, idx) => (
                                                        <div key={idx} className="aspect-square bg-gray-50 rounded-lg border border-gray-200 relative group overflow-hidden">
                                                            <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newImages = formData.images.filter((_, i) => i !== idx);
                                                                    setFormData({ ...formData, images: newImages });
                                                                }}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                            >✕</button>
                                                        </div>
                                                    ))}

                                                    {/* Gallery Upload Box */}
                                                    <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition-colors relative cursor-pointer">
                                                        <span className="text-2xl text-gray-400">+</span>
                                                        <label className="absolute inset-0 cursor-pointer">
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={async (e) => {
                                                                    const files = Array.from(e.target.files);
                                                                    for (const file of files) {
                                                                        try {
                                                                            const url = await uploadImage(file);
                                                                            const fullUrl = url.startsWith("http") ? url : `http://localhost:8080${url}`;
                                                                            setFormData(prev => ({ ...prev, images: [...prev.images, fullUrl] }));
                                                                        } catch (err) { console.error(err); }
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            ) : (
                                /* VARIANTS TAB */
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-100 text-blue-800 px-6 py-4 rounded-xl flex items-center gap-4">
                                        <span className="text-2xl">⚡</span>
                                        <div>
                                            <p className="font-bold">Variant Mode Active</p>
                                            <p className="text-sm">Adding variants overrides the base price and total stock automatically.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.variants.map((variant, idx) => (
                                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative group transition-all hover:shadow-md">
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(idx)}
                                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-full"
                                                    title="Remove Variant"
                                                >
                                                    ✕
                                                </button>

                                                <div className="grid grid-cols-12 gap-6 items-start">
                                                    {/* Variant Image - Col 2 */}
                                                    <div className="col-span-12 md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Image</label>
                                                        <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center relative hover:border-blue-400 transition-colors">
                                                            {variant.imageUrl ? (
                                                                <>
                                                                    <img src={variant.imageUrl} className="w-full h-full object-contain rounded-lg p-1" alt="" />
                                                                    <button type="button" className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs shadow" onClick={() => updateVariant(idx, 'imageUrl', '')}>✕</button>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-300 text-2xl">+</span>
                                                            )}

                                                            <label className="absolute inset-0 cursor-pointer">
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            try {
                                                                                const url = await uploadImage(file);
                                                                                const fullUrl = url.startsWith("http") ? url : `http://localhost:8080${url}`;
                                                                                updateVariant(idx, 'imageUrl', fullUrl);
                                                                            } catch (e) { }
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Variant Details - Col 10 */}
                                                    <div className="col-span-12 md:col-span-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div className="col-span-2 md:col-span-1">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color/Name</label>
                                                            <input
                                                                type="text"
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-black outline-none"
                                                                placeholder="e.g. Red"
                                                                value={variant.color}
                                                                onChange={e => updateVariant(idx, 'color', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-2 md:col-span-2">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Specs (Optional)</label>
                                                            <input
                                                                type="text"
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                                                                placeholder="e.g. 16GB RAM, 1TB SSD"
                                                                value={variant.specifications}
                                                                onChange={e => updateVariant(idx, 'specifications', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-1 md:col-span-1">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                                                            <input
                                                                type="number"
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                                                                value={variant.price}
                                                                onChange={e => updateVariant(idx, 'price', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-1 md:col-span-1">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                                                            <input
                                                                type="number"
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black outline-none"
                                                                value={variant.stockQuantity}
                                                                onChange={e => updateVariant(idx, 'stockQuantity', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-black hover:text-black hover:bg-white transition-all text-lg flex items-center justify-center gap-2"
                                    >
                                        <span>+ Add Another Variant</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
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
