import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getReviews, createReview, getRelatedProducts } from "../services/productService";
import { getActiveBanners } from "../services/bannerService";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({ content: "", rating: 5 });
    const [activeImage, setActiveImage] = useState(null);

    // Variant State
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Banners State
    const [banners, setBanners] = useState({ left: null, right: null });

    // Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        loadProductData();
        loadBanners();
    }, [id]);

    // Auto-scroll logic for Related Products
    useEffect(() => {
        if (relatedProducts.length > 0) {
            const interval = setInterval(() => {
                nextSlide();
            }, 3000); // 3 seconds
            return () => clearInterval(interval);
        }
    }, [currentSlide, relatedProducts]);

    const loadBanners = async () => {
        try {
            const allBanners = await getActiveBanners();
            const left = allBanners.find(b => b.section === "PRODUCT_LEFT");
            const right = allBanners.find(b => b.section === "PRODUCT_RIGHT");
            setBanners({ left, right });
        } catch (error) {
            console.error("Failed to load banners", error);
        }
    };

    const loadProductData = async () => {
        setLoading(true);
        try {
            const productData = await getProductById(id);
            setProduct(productData);

            // Set default variant if exists
            if (productData.variants && productData.variants.length > 0) {
                // Sort by price or default logic? Just take first.
                setSelectedVariant(productData.variants[0]);
                if (productData.variants[0].imageUrl) {
                    setActiveImage(productData.variants[0].imageUrl);
                }
            } else {
                setSelectedVariant(null);
                setActiveImage(null);
            }

            const [reviewsData, relatedData] = await Promise.all([
                getReviews(id),
                productData.category ? getRelatedProducts(productData.category.id) : []
            ]);

            setReviews(reviewsData);
            setRelatedProducts(relatedData.filter(p => p.id !== parseInt(id))); // Exclude current product
        } catch (error) {
            console.error("Error loading product", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            alert("Please login to leave a review");
            return;
        }
        const user = JSON.parse(userJson);

        try {
            const newReview = await createReview({
                productId: id,
                userId: user.id || 1,
                content: reviewForm.content,
                rating: reviewForm.rating
            });
            setReviews([newReview, ...reviews]);
            setReviewForm({ content: "", rating: 5 });
        } catch (error) {
            alert("Failed to post review");
        }
    };

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
        if (variant.imageUrl) {
            setActiveImage(variant.imageUrl);
        }
    };

    const nextSlide = () => {
        if (relatedProducts.length <= 4) return;
        setCurrentSlide(prev => (prev + 1) % (relatedProducts.length - 3));
    };

    const prevSlide = () => {
        if (relatedProducts.length <= 4) return;
        setCurrentSlide(prev => (prev - 1 < 0 ? relatedProducts.length - 4 : prev - 1));
    };

    // Breadcrumb recursive renderer
    const renderBreadcrumbs = (category) => {
        const paths = [];
        let current = category;
        while (current) {
            paths.unshift(current);
            current = current.parent;
        }

        return (
            <>
                <Link to="/" className="hover:text-primary">Home</Link> /
                <Link to="/products" className="hover:text-primary mx-1">Products</Link> /
                {paths.map((cat) => (
                    <span key={cat.id}>
                        <Link to={`/products?category=${cat.id}`} className="hover:text-primary mx-1">{cat.name}</Link>
                        /
                    </span>
                ))}
            </>
        );
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!product) return <div className="p-10 text-center">Product not found</div>;

    const displayPrice = selectedVariant ? selectedVariant.price : product.price;
    const displayStock = selectedVariant ? selectedVariant.stockQuantity : product.quantity;

    return (
        <div className="bg-background min-h-screen font-sans text-text flex flex-col">
            <Navbar />

            <div className="flex-1 relative">
                {/* Left Banner */}
                <div className="hidden 2xl:block absolute left-4 top-4 bottom-4 w-40 flex items-start justify-center pt-20">
                    {banners.left ? (
                        <a href={banners.left.link || "#"} className="block w-full">
                            <img src={banners.left.imageUrl} alt="Ad" className="w-full rounded-lg shadow-sm" />
                        </a>
                    ) : (
                        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                            AD Banner Left
                        </div>
                    )}
                </div>

                {/* Right Banner */}
                <div className="hidden 2xl:block absolute right-4 top-4 bottom-4 w-40 flex items-start justify-center pt-20">
                    {banners.right ? (
                        <a href={banners.right.link || "#"} className="block w-full">
                            <img src={banners.right.imageUrl} alt="Ad" className="w-full rounded-lg shadow-sm" />
                        </a>
                    ) : (
                        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                            AD Banner Right
                        </div>
                    )}
                </div>

                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-500 mb-6">
                        {product.category ? renderBreadcrumbs(product.category) : (
                            <>
                                <Link to="/" className="hover:text-primary">Home</Link> /
                                <Link to="/products" className="hover:text-primary mx-1">Products</Link> /
                            </>
                        )}
                        <span className="text-gray-800 font-medium ml-1">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Image Section */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-center relative overflow-hidden group">
                                <img
                                    src={activeImage || product.imageUrl || `https://via.placeholder.com/500?text=${product.name}`}
                                    alt={product.name}
                                    className="max-h-[400px] object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                                {(() => {
                                    const allImages = [
                                        product.imageUrl,
                                        ...(product.images || []).map(i => i.imageUrl),
                                        ...(product.variants || []).filter(v => v.imageUrl).map(v => v.imageUrl)
                                    ].filter(Boolean);

                                    if (allImages.length > 1) {
                                        const currentIndex = allImages.indexOf(activeImage || product.imageUrl);
                                        const nextImage = () => {
                                            const nextIdx = (currentIndex + 1) % allImages.length;
                                            setActiveImage(allImages[nextIdx]);
                                        };
                                        const prevImage = () => {
                                            const prevIdx = (currentIndex - 1 + allImages.length) % allImages.length;
                                            setActiveImage(allImages[prevIdx]);
                                        };

                                        return (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                                                >
                                                    ←
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                                                >
                                                    →
                                                </button>
                                            </>
                                        );
                                    }
                                })()}
                            </div>
                            {/* Thumbnails */}
                            {product.images && product.images.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    <button
                                        onClick={() => { setActiveImage(product.imageUrl); setSelectedVariant(null); }}
                                        className={`w-20 h-20 border-2 rounded-lg p-1 bg-white ${activeImage === product.imageUrl ? 'border-red-600' : 'border-gray-200'}`}
                                    >
                                        <img src={product.imageUrl} className="w-full h-full object-contain" alt="Main" />
                                    </button>
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={img.id || idx}
                                            onClick={() => setActiveImage(img.imageUrl)}
                                            className={`w-20 h-20 border-2 rounded-lg p-1 bg-white ${activeImage === img.imageUrl ? 'border-red-600' : 'border-gray-200'}`}
                                        >
                                            <img src={img.imageUrl} className="w-full h-full object-contain" alt={`View ${idx + 1}`} />
                                        </button>
                                    ))}
                                    {/* Variant Images as well? Maybe not needed if they selecting variant sets the image */}
                                    {product.variants?.filter(v => v.imageUrl).map((v, idx) => (
                                        <button
                                            key={`v-${idx}`}
                                            onClick={() => handleVariantSelect(v)}
                                            className={`w-20 h-20 border-2 rounded-lg p-1 bg-white ${activeImage === v.imageUrl ? 'border-red-600' : 'border-gray-200'}`}
                                            title={v.color}
                                        >
                                            <img src={v.imageUrl} className="w-full h-full object-contain" alt={v.color} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-yellow-500 text-lg">★★★★★</span>
                                <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                            </div>

                            <div className="text-3xl text-red-600 font-bold mb-6">
                                {displayPrice?.toLocaleString()} ₫
                            </div>

                            {/* Variants Selection */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase">Select Option</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.map((v, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleVariantSelect(v)}
                                                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${selectedVariant === v
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                    }`}
                                            >
                                                {v.color} {v.specifications && `- ${v.specifications}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-700 space-y-2">
                                <p><strong>Category:</strong> {product.category?.name || "N/A"}</p>
                                <p>
                                    <strong>Availability:</strong>
                                    {displayStock > 0 ? (
                                        <span className="text-green-600 font-bold ml-1">In Stock ({displayStock})</span>
                                    ) : (
                                        <span className="text-red-600 font-bold ml-1">Out of Stock</span>
                                    )}
                                </p>
                                <p><strong>Warranty:</strong> 24 Months</p>
                                {product.wattage && <p><strong>Wattage:</strong> {product.wattage}W</p>}
                            </div>

                            {/* Technical Specifications Table */}
                            {product.specifications && (
                                <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                                    <h3 className="bg-gray-100 px-4 py-2 font-bold text-gray-800 text-sm border-b border-gray-200">Technical Specifications</h3>
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {(() => {
                                                try {
                                                    const specs = JSON.parse(product.specifications);
                                                    if (Array.isArray(specs)) {
                                                        return specs.map((item, idx) => (
                                                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                                <td className="px-4 py-2 font-semibold text-gray-600 border-b border-gray-100 w-1/3">{item.key}</td>
                                                                <td className="px-4 py-2 text-gray-800 border-b border-gray-100">{item.value}</td>
                                                            </tr>
                                                        ));
                                                    }
                                                    // Handle legacy object if exists
                                                    if (typeof specs === 'object') {
                                                        return Object.entries(specs).map(([key, value], idx) => (
                                                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                                <td className="px-4 py-2 font-semibold text-gray-600 border-b border-gray-100 w-1/3">{key}</td>
                                                                <td className="px-4 py-2 text-gray-800 border-b border-gray-100">{value}</td>
                                                            </tr>
                                                        ));
                                                    }
                                                    return <tr><td className="px-4 py-2">{product.specifications}</td></tr>;
                                                } catch (e) {
                                                    return <tr><td className="px-4 py-2 whitespace-pre-wrap">{product.specifications}</td></tr>;
                                                }
                                            })()}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => addToCart(product, 1, selectedVariant)}
                                    disabled={displayStock <= 0}
                                    className={`flex-1 py-3 rounded-lg font-bold transition shadow-lg text-lg uppercase ${displayStock > 0
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {displayStock > 0 ? 'Buy Now' : 'Out of Stock'}
                                </button>
                                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Add to Wishlist
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description & Reviews */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100">Product Description</h2>
                                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                                    {product.description || "No description available for this product."}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100">Customer Reviews</h2>

                                {/* Review Form */}
                                <form onSubmit={handleReviewSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-sm mb-3">Write a review</h3>
                                    <div className="mb-3">
                                        <textarea
                                            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            rows="3"
                                            placeholder="Share your thoughts..."
                                            value={reviewForm.content}
                                            onChange={e => setReviewForm({ ...reviewForm, content: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Rating:</span>
                                            <select
                                                value={reviewForm.rating}
                                                onChange={e => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                            >
                                                <option value="5">5 Stars</option>
                                                <option value="4">4 Stars</option>
                                                <option value="3">3 Stars</option>
                                                <option value="2">2 Stars</option>
                                                <option value="1">1 Star</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-black transition">Submit Review</button>
                                    </div>
                                </form>

                                {/* Reviews List */}
                                <div className="space-y-6">
                                    {reviews.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No reviews yet.</p>
                                    ) : (
                                        reviews.map(review => (
                                            <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                                                            {review.user?.username?.[0]?.toUpperCase() || "U"}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-gray-800">{review.user?.username || "Anonymous"}</p>
                                                            <div className="text-yellow-500 text-xs">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm">{review.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Suggested Products Sidebar / Carousel */}
                        <div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Related Products</h3>
                                    <div className="flex gap-2">
                                        <button onClick={prevSlide} className="p-1 rounded-full hover:bg-gray-100 text-gray-600">←</button>
                                        <button onClick={nextSlide} className="p-1 rounded-full hover:bg-gray-100 text-gray-600">→</button>
                                    </div>
                                </div>

                                <div className="relative overflow-hidden min-h-[400px]">
                                    {relatedProducts.length === 0 ? (
                                        <p className="text-gray-400 text-sm">No related products found.</p>
                                    ) : (
                                        <div
                                            className="transition-transform duration-500 ease-in-out flex flex-col gap-4"
                                            style={{ transform: `translateY(-${currentSlide * 0}px)` }} // Vertical stacking doesn't slide well, let's just show a subset
                                        >
                                            {/* Actually for sidebar vertical list, fading or sliding valid? 
                                               Let's simplify: Display 3 items, slide replaces them.
                                           */}
                                            {relatedProducts.slice(currentSlide, currentSlide + 3).map(p => (
                                                <ProductCard key={p.id} product={p} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
