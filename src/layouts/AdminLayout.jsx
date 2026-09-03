import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div className="admin-layout">
      {/* ==========================================
          ADMIN SIDEBAR
      ========================================== */}

      <aside className="admin-sidebar">
        {/* LOGO */}

        <Link to="/admin" className="admin-logo">
          TechZone
          <span>⚡</span>
        </Link>

        <p className="admin-panel-title">
          ADMIN PANEL
        </p>

        {/* NAVIGATION */}

        <nav className="admin-nav">

          {/* DASHBOARD */}

          <Link
            to="/admin"
            className={
              isActive("/admin")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >
            📊 Dashboard
          </Link>

          {/* PRODUCTS */}

          <Link
            to="/admin/products"
            className={
              isActive("/admin/products")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >
            📦 Products
          </Link>

          {/* ORDERS */}

          <Link
            to="/admin/orders"
            className={
              isActive("/admin/orders")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >
            🛒 Orders
          </Link>

          {/* USERS */}

          <Link
            to="/admin/users"
            className={
              isActive("/admin/users")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >
            👥 Users
          </Link>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          <Link
            to="/"
            className="admin-nav-link"
          >
            🏠 Back to Store
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>
      </aside>

      {/* ==========================================
          ADMIN MAIN AREA
      ========================================== */}

      <div className="admin-main">

        {/* TOP BAR */}

        <header className="admin-header">

          <div>
            <h1>Admin Panel</h1>

            <p>
              Manage your TechZone store
            </p>
          </div>

          {/* ADMIN USER */}

          <div className="admin-user">

            <div className="admin-user-icon">
              👨‍💼
            </div>

            <div>
              <strong>
                {user?.name || "Admin"}
              </strong>

              <span>
                Administrator
              </span>
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="admin-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;