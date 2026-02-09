import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import News from "./pages/News";
import Checkout from "./pages/Checkout";
import BuildPC from './pages/BuildPC';
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import AdminLayout from "./layouts/AdminLayout";
import ProductManager from "./pages/admin/ProductManager";
import UserManager from "./pages/admin/UserManager";
import BannerManager from "./pages/admin/BannerManager";
import OrderManager from "./pages/admin/OrderManager";
import CategoryManager from "./pages/admin/CategoryManager";
import NewsManager from "./pages/admin/NewsManager";
import FloatingActions from "./components/FloatingActions";
import LoginSuccess from "./pages/LoginSuccess";
import ProductDetail from "./pages/ProductDetail";
import OrderHistory from "./pages/OrderHistory";
import OrderSuccess from "./pages/OrderSuccess";

// Admin Placeholders
const Dashboard = () => <div className="text-center py-20 text-gray-400">Dashboard Stats Coming Soon</div>;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App relative">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/news" element={<News />} />
              <Route path="/build-pc" element={<BuildPC />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login-success" element={<LoginSuccess />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="users" element={<UserManager />} />
                <Route path="banners" element={<BannerManager />} />
                <Route path="news" element={<NewsManager />} />
                <Route path="orders" element={<OrderManager />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="*" element={<Dashboard />} />
              </Route>
            </Routes>

            {/* Global Widgets */}
            <FloatingActions />
          </BrowserRouter>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
