import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CategorySidebar from '../components/CategorySidebar';
import { getCategories, getAllProducts } from "../services/productService";
import { getActiveBanners } from "../services/bannerService";
import HomeBanner from '../components/HomeBanner';
import ProductCarousel from '../components/ProductCarousel';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load categories, products, and banners
    const loadData = async () => {
      try {
        const [prodData, catData, bannerData] = await Promise.all([
          getAllProducts(),
          getCategories(),
          getActiveBanners().catch(err => []) // Fail safe for banners
        ]);

        // Safety check: Handle Spring Page object or direct List
        const finalProducts = Array.isArray(prodData) ? prodData : (prodData?.content || []);
        const finalCategories = Array.isArray(catData) ? catData : [];
        const finalBanners = Array.isArray(bannerData) ? bannerData : [];

        setProducts(finalProducts);
        setCategories(finalCategories);
        setBanners(finalBanners);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        // Optional: Set empty arrays on error to be safe
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // helper to get category id by name
  const getCatId = (name) => {
    const cat = categories.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
    return cat ? cat.id : null;
  };

  // Organize products by category
  const laptopProducts = products.filter(p => {
    // Check if category or parent category matches "Laptop"
    const cat = categories.find(c => c.id === p.category?.id);
    return cat && (cat.name.toLowerCase().includes('laptop') || cat.parent?.name.toLowerCase().includes('laptop'));
  });

  const pcProducts = products.filter(p => {
    const cat = categories.find(c => c.id === p.category?.id);
    return cat && (cat.name.toLowerCase().includes('pc') || cat.parent?.name.toLowerCase().includes('pc'));
  });

  const componentProducts = products.filter(p => {
    const cat = categories.find(c => c.id === p.category?.id);
    return cat && (cat.name.toLowerCase().includes('linh kiện') || cat.name.toLowerCase().includes('component') || cat.parent?.name.toLowerCase().includes('component'));
  });

  const gearProducts = products.filter(p => {
    const cat = categories.find(c => c.id === p.category?.id);
    return cat && (cat.name.toLowerCase().includes('gear') || cat.parent?.name.toLowerCase().includes('gear'));
  });

  // Filter banners by section
  const sliderBanners = banners.filter(b => !b.section || b.section === 'HOME_SLIDER').sort((a, b) => a.displayOrder - b.displayOrder);
  const rightTopBanners = banners.filter(b => b.section === 'HOME_RIGHT_TOP').sort((a, b) => a.displayOrder - b.displayOrder);
  const rightBottomBanners = banners.filter(b => b.section === 'HOME_RIGHT_BOTTOM').sort((a, b) => a.displayOrder - b.displayOrder);
  const wideStripBanners = banners.filter(b => b.section === 'HOME_WIDE_STRIP').sort((a, b) => a.displayOrder - b.displayOrder);

  const renderPromoBanner = (banner, placeholderText) => {
    if (banner) {
      return (
        <div className="flex-1 bg-white rounded-lg overflow-hidden relative cursor-pointer group h-full">
          <img src={banner.imageUrl} alt="Promo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      );
    }
    return (
      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer group h-full flex items-center justify-center">
        <span className="text-gray-500 font-bold">{placeholderText || "Ad Space"}</span>
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen font-sans text-text">
      <Navbar />

      <main className="container-custom mx-auto py-6 space-y-12">
        {/* ===== HERO SECTION ===== */}
        <section className="grid grid-cols-12 gap-4 h-auto md:h-[400px]">
          {/* Left Sidebar - Categories */}
          <div className="col-span-3 hidden md:block h-full">
            <CategorySidebar categories={categories} />
          </div>

          {/* Center - Main Slider */}
          <div className="col-span-12 md:col-span-6 h-full">
            <HomeBanner banners={sliderBanners} />
          </div>

          {/* Right - Promo Banners */}
          <div className="col-span-3 hidden lg:flex flex-col gap-4 h-full">
            {/* Top Right Banner */}
            {rightTopBanners.length > 0 ? renderPromoBanner(rightTopBanners[0]) : (
              <div className="flex-1 bg-white rounded-lg overflow-hidden relative cursor-pointer group">
                <img src="https://via.placeholder.com/400x200?text=RTX+40+Series" alt="Promo 1" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            {/* Bottom Right Banner */}
            {rightBottomBanners.length > 0 ? renderPromoBanner(rightBottomBanners[0]) : (
              <div className="flex-1 bg-white rounded-lg overflow-hidden relative cursor-pointer group">
                <img src="https://via.placeholder.com/400x200?text=Gaming+Gear+Sale" alt="Promo 2" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        </section>

        {/* ===== FLASH SALE ===== */}
        <section>
          <div className="flex items-center justify-between mb-4 border-b-2 border-red-600 pb-2">
            <h2 className="text-2xl font-bold uppercase text-red-600 flex items-center gap-2">
              <span className="text-3xl">🔥</span> Flash Sale
            </h2>
            <Link to="/products" className="text-sm font-medium hover:text-red-600">View All →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(n => <div key={n} className="h-80 bg-gray-100 rounded animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.slice(0, 5).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ===== CATEGORY SECTION: LAPTOPS ===== */}
        {laptopProducts.length > 0 && (
          <ProductCarousel
            title="Laptop & Macbook"
            icon="💻"
            products={laptopProducts}
            link={`/products?category=${getCatId('laptop')}`}
          />
        )}

        {/* ===== CATEGORY SECTION: PC GAMING ===== */}
        {pcProducts.length > 0 && (
          <ProductCarousel
            title="PC Gaming & Workstation"
            icon="🖥️"
            products={pcProducts}
            link={`/products?category=${getCatId('pc')}`}
          />
        )}



        {/* ===== CATEGORY SECTION: COMPONENTS ===== */}
        {componentProducts.length > 0 && (
          <ProductCarousel
            title="Linh Kiện PC (Components)"
            icon="⚙️"
            products={componentProducts}
            link={`/products?category=${getCatId('component')}`}
          />
        )}

        {/* ===== CATEGORY SECTION: GEAR ===== */}
        {gearProducts.length > 0 && (
          <ProductCarousel
            title="Gaming Gear"
            icon="🎧"
            products={gearProducts}
            link={`/products?category=${getCatId('gear')}`}
          />
        )}

        {/* ===== BANNER STRIP ===== */}
        <section className="py-8 bg-gray-50 -mx-4 px-4">
          <div className="max-w-6xl mx-auto">
            {wideStripBanners.length > 0 ? (
              <div className="rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.01] duration-300">
                <img src={wideStripBanners[0].imageUrl} alt="Wide Banner" className="w-full h-auto block" />
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100">
                <img src="https://placehold.co/1200x250?text=Why+Choose+Us" alt="Wide Banner" className="w-full h-auto block" />
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
