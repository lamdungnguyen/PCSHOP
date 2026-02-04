import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  // Safe handling of missing data
  const { name, price, category, imageUrl } = product || {};
  // Safe default for imageUrl if missing
  const image = product.imageUrl || `https://via.placeholder.com/300?text=${product.name}`;

  return (
    <div className="group bg-white rounded-lg border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300 relative flex flex-col h-full">
      {/* Discount Badge - Mock */}
      <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
        -15%
      </div>

      {/* Image Container */}
      {/* Image Container */}
      <div className="relative p-4 aspect-square flex items-center justify-center bg-white group-hover:opacity-90 transition-opacity">
        <Link to={`/product/${product.id}`} className="absolute inset-0 z-0" />
        <img
          src={image}
          alt={product.name}
          className="max-h-full max-w-full object-contain relative z-0 pointer-events-none"
        />

        {/* Action Buttons Overlay */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="bg-primary hover:bg-primary-hover text-white p-2 rounded-full shadow-lg cursor-pointer"
            title="Add to Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 border-t border-gray-100">
        <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
          {product.category?.name || "Accessory"}
        </div>

        <Link to={`/product/${product.id}`} className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors cursor-pointer" title={product.name}>
          {product.name}
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 line-through">
              {(product.price * 1.15).toLocaleString()} ₫
            </span>
          </div>
          <div className="text-red-600 font-bold text-lg">
            {product.price.toLocaleString()} ₫
          </div>

          <div className="flex items-center gap-1 mt-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs">
              ✓
            </span>
            <span className="text-[10px] text-green-700 font-medium">In Stock</span>
          </div>
        </div>
      </div>
    </div>
  );
}
