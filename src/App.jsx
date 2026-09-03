import { Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./components/layout/CustomerLayout";

// Customer Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Customer Components
import Cart from "./components/common/Cart";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Admin
import AdminRoute from "./components/common/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <Routes>

      {/* ================================
          CUSTOMER ROUTES
      ================================= */}

      <Route element={<CustomerLayout />}>

        <Route path="/" element={<Home />} />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ================================
          AUTH ROUTES
      ================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================================
          ADMIN ROUTES
      ================================= */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="products"
          element={<ProductManagement />}
        />

        <Route
          path="orders"
          element={<AdminOrders />}
        />

        <Route
          path="users"
          element={<AdminUsers />}
        />
      </Route>

    </Routes>
  );
}

export default App;