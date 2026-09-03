import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { useState } from "react";

import { useStore } from "../../context/StoreContext";

function Navbar() {
  const { user, logout } = useAuth();

  const { cartItems } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  // ==========================================
  // TOTAL CART ITEMS
  // ==========================================

  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  // ==========================================
  // CHECK IF CURRENT USER IS ADMIN
  // ==========================================

  const isAdmin = user?.role === "admin";

  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {
    logout();

    setMenuOpen(false);
  }

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  function closeMenu() {
    setMenuOpen(false);
  }

  // ==========================================
  // ACTIVE LINK
  // ==========================================

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <nav className="navbar">

      {/* =====================================
          LOGO
      ====================================== */}

      <Link
        to="/"
        className="navbar-logo"
        onClick={closeMenu}
      >
        TechZone
        <span>⚡</span>
      </Link>


      {/* =====================================
          HAMBURGER
      ====================================== */}

      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>


      {/* =====================================
          NAVIGATION
      ====================================== */}

      <div
        className={`navbar-links ${
          menuOpen ? "navbar-links-open" : ""
        }`}
      >

        {/* HOME */}

        <Link
          to="/"
          onClick={closeMenu}
          className={
            isActive("/")
              ? "active-nav-link"
              : ""
          }
        >
          🏠 Home
        </Link>


        {/* =====================================
            ADMIN DASHBOARD
        ====================================== */}

        {isAdmin && (
          <Link
            to="/admin"
            onClick={closeMenu}
            className={
              location.pathname.startsWith("/admin")
                ? "active-nav-link admin-dashboard-link"
                : "admin-dashboard-link"
            }
          >
            📊 Admin Dashboard
          </Link>
        )}


        {/* WISHLIST */}

        <Link
          to="/wishlist"
          onClick={closeMenu}
          className={
            isActive("/wishlist")
              ? "active-nav-link"
              : ""
          }
        >
          ❤️ Wishlist
        </Link>


        {/* CART */}

        <Link
          to="/cart"
          onClick={closeMenu}
          className={
            isActive("/cart")
              ? "active-nav-link cart-link"
              : "cart-link"
          }
        >
          🛒 Cart

          {totalItems > 0 && (
            <span className="cart-badge">
              {totalItems}
            </span>
          )}
        </Link>


        {/* =====================================
            ORDERS
        ====================================== */}

        {user && (
          <Link
            to="/orders"
            onClick={closeMenu}
            className={
              isActive("/orders")
                ? "active-nav-link"
                : ""
            }
          >
            📦 My Orders
          </Link>
        )}


        {/* =====================================
            AUTHENTICATION
        ====================================== */}

        {!user ? (
          <div className="auth-links">

            <Link
              to="/login"
              onClick={closeMenu}
              className="login-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="register-link"
            >
              Register
            </Link>

          </div>
        ) : (
          <div className="user-section">

            <span className="user-greeting">
              Hi, {user.name} 👋
            </span>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;