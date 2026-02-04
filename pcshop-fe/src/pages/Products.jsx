import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, searchProducts, getCategories } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategorySidebar from "../components/CategorySidebar";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Get filters from URL
    const categoryId = searchParams.get("category");
    const searchQuery = searchParams.get("q");

    useEffect(() => {
        // Fetch categories for sidebar
        getCategories().then(setCategories).catch(err => console.error("Error loading categories", err));
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchProducts = async () => {
            try {
                if (categoryId || searchQuery) {
                    const params = {};
                    if (categoryId) params.categoryId = categoryId;
                    if (searchQuery) params.name = searchQuery;
                    const data = await searchProducts(params);
                    setProducts(data);
                } else {
                    const data = await getAllProducts();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, searchQuery]);

    const handleCategoryClick = (id) => {
        if (id === categoryId) {
            searchParams.delete("category");
        } else {
            searchParams.set("category", id);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 container-custom mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                        <CategorySidebar categories={categories} />

                        {/* Price Filter Mock */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <input type="number" placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded text-sm" />
                                <span>-</span>
                                <input type="number" placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded text-sm" />
                            </div>
                            <button className="w-full bg-gray-900 text-white py-2 rounded text-sm hover:bg-black transition-colors">Apply</button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {categoryId
                                    ? `Category: ${categories.find(c => c.id.toString() === categoryId)?.name || '...'}`
                                    : searchQuery ? `Search: "${searchQuery}"` : "All Products"
                                }
                            </h1>
                            <span className="text-gray-500 text-sm">{products.length} products found</span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                    <div key={n} className="bg-white h-80 rounded-lg shadow-sm animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                                <button
                                    onClick={() => setSearchParams({})}
                                    className="mt-4 text-primary font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
