import { useEffect, useState } from "react";
import { getAllBanners, createBanner, deleteBanner, uploadImage } from "../../services/bannerService";

const SECTIONS = {
    HOME_SLIDER: {
        id: "HOME_SLIDER",
        label: "Home Main Slider",
        desc: "The main carousel at the top of the home page.",
        recWidth: 1200,
        recHeight: 600,
        ratio: "2:1"
    },
    HOME_RIGHT_TOP: {
        id: "HOME_RIGHT_TOP",
        label: "Home Right Top",
        desc: "Small banner to the right of the slider (Top).",
        recWidth: 400,
        recHeight: 190,
        ratio: "~2:1"
    },
    HOME_RIGHT_BOTTOM: {
        id: "HOME_RIGHT_BOTTOM",
        label: "Home Right Bottom",
        desc: "Small banner to the right of the slider (Bottom).",
        recWidth: 400,
        recHeight: 190,
        ratio: "~2:1"
    },
    HOME_WIDE_STRIP: {
        id: "HOME_WIDE_STRIP",
        label: "Home Wide Strip",
        desc: "Wide banner displayed below the featured sections.",
        recWidth: 1200,
        recHeight: 150,
        ratio: "8:1"
    },
    PRODUCT_LEFT: {
        id: "PRODUCT_LEFT",
        label: "Product Page Left",
        desc: "Vertical banner on the left side of product detail page (Desktop only).",
        recWidth: 160,
        recHeight: 600,
        ratio: "1:4"
    },
    PRODUCT_RIGHT: {
        id: "PRODUCT_RIGHT",
        label: "Product Page Right",
        desc: "Vertical banner on the right side of product detail page (Desktop only).",
        recWidth: 160,
        recHeight: 600,
        ratio: "1:4"
    }
};

export default function BannerManager() {
    const [banners, setBanners] = useState([]);
    const [formData, setFormData] = useState({
        imageUrl: "",
        link: "",
        displayOrder: 0,
        active: true,
        section: "HOME_SLIDER"
    });
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            const data = await getAllBanners();
            setBanners(data);
        } catch (error) {
            console.error("Failed to load banners", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this banner?")) return;
        try {
            await deleteBanner(id);
            setBanners(banners.filter(b => b.id !== id));
        } catch (error) {
            alert("Failed to delete banner");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            alert("Please provide an image URL or upload one.");
            return;
        }
        try {
            await createBanner(formData);
            setFormData({ imageUrl: "", link: "", displayOrder: 0, active: true, section: formData.section });
            loadBanners();
        } catch (error) {
            alert("Failed to create banner");
        }
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

    const currentSectionInfo = SECTIONS[formData.section] || SECTIONS.HOME_SLIDER;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Banner Management</h1>

            {/* Create Banner Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-12">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary p-2 rounded-lg">➕</span> Add New Banner
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Image Upload */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">Banner Image</label>
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all h-64 flex flex-col items-center justify-center relative ${dragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-gray-300 hover:border-primary hover:bg-gray-50"
                                    }`}
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                            >
                                {formData.imageUrl ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img src={formData.imageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded shadow-sm" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: "" })}
                                            className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="text-5xl text-gray-300">�️</div>
                                        <p className="text-gray-500 font-medium">{uploading ? "Uploading..." : "Drag & Drop or Click to Upload"}</p>
                                        <label className="inline-block px-5 py-2.5 bg-gray-900 text-white hover:bg-black rounded-lg text-sm font-bold cursor-pointer transition-transform hover:-translate-y-0.5 shadow-lg shadow-gray-200">
                                            Browse Files
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
                            <p className="text-xs text-gray-500 text-center">
                                Max size: 5MB. Formats: JPG, PNG, WEBP.
                            </p>
                        </div>

                        {/* Right Column: Details */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Position / Section</label>
                                <select
                                    value={formData.section}
                                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium"
                                >
                                    {Object.values(SECTIONS).map(sec => (
                                        <option key={sec.id} value={sec.id}>{sec.label}</option>
                                    ))}
                                </select>
                                <div className="mt-3 bg-blue-50 text-blue-700 text-sm p-4 rounded-lg flex items-start gap-3">
                                    <span className="text-xl">ℹ️</span>
                                    <div>
                                        <p className="font-bold">{currentSectionInfo.desc}</p>
                                        <p className="mt-1">Recommended Size: <span className="font-mono bg-blue-100 px-1 rounded">{currentSectionInfo.recWidth}x{currentSectionInfo.recHeight}px</span> ({currentSectionInfo.ratio})</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Link URL (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g., /products/gpu-sale"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Display Order</label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div className="flex items-end mb-3">
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={formData.active}
                                                onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">Active</span>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-primary hover:bg-black text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all transform active:scale-95 text-lg">
                                Add Banner
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Banners List - Grouped by Section */}
            <div className="space-y-12">
                {Object.values(SECTIONS).map(section => {
                    const sectionBanners = banners.filter(b => (b.section || 'HOME_SLIDER') === section.id);
                    if (sectionBanners.length === 0) return null;

                    return (
                        <div key={section.id} className="animate-fade-in">
                            <div className="flex items-center gap-4 mb-4 border-b pb-2 border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800">{section.label}</h3>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-mono">
                                    {sectionBanners.length} banners
                                </span>
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-mono ml-auto">
                                    Ratio: {section.ratio} ({section.recWidth}x{section.recHeight})
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sectionBanners.map(banner => (
                                    <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow relative">
                                        <div className="bg-gray-100 relative overflow-hidden" style={{ aspectRatio: section.ratio === '2:1' ? '2/1' : section.ratio === '8:1' ? '8/1' : 'auto' }}>
                                            <img
                                                src={banner.imageUrl}
                                                alt="Banner"
                                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!banner.active ? 'grayscale opacity-70' : ''}`}
                                            />
                                            {!banner.active && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <span className="bg-black/70 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider">Inactive</span>
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm">
                                                Order: {banner.displayOrder}
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Link</p>
                                                    <p className="text-sm text-blue-600 truncate hover:underline cursor-pointer" title={banner.link}>
                                                        {banner.link || "No Link"}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(banner.id)}
                                                    className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                                    title="Delete Banner"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {banners.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                        <p className="text-gray-400 font-medium">No banners found. Start by adding one above!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
