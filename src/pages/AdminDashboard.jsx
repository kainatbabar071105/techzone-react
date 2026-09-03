import { useEffect, useState } from "react";

function AdminDashboard() {
  const [data, setData] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
    placed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    averageOrder: 0,
  });

  const [lowStockProducts, setLowStockProducts] = useState([]);

  const [recentOrders, setRecentOrders] = useState([]);

  function loadDashboardData() {
    const products = JSON.parse(localStorage.getItem("products")) || [];

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // ======================================
    // REVENUE
    // ======================================

    const revenue = orders.reduce((total, order) => {
      return total + Number(order.total || 0);
    }, 0);

    // ======================================
    // ORDER STATUS
    // ======================================

    const placed = orders.filter((order) => order.status === "Placed").length;

    const processing = orders.filter(
      (order) => order.status === "Processing",
    ).length;

    const shipped = orders.filter((order) => order.status === "Shipped").length;

    const delivered = orders.filter(
      (order) => order.status === "Delivered",
    ).length;

    const cancelled = orders.filter(
      (order) => order.status === "Cancelled",
    ).length;

    // ======================================
    // AVERAGE ORDER
    // ======================================

    const averageOrder = orders.length > 0 ? revenue / orders.length : 0;

    // ======================================
    // LOW STOCK
    // ======================================

    const lowStock = products.filter((product) => Number(product.stock) <= 5);

    // ======================================
    // RECENT ORDERS
    // ======================================

    const recent = [...orders]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, 5);

    // ======================================
    // UPDATE DATA
    // ======================================

    setData({
      products: products.length,
      users: users.length,
      orders: orders.length,

      revenue,

      placed,
      processing,
      shipped,
      delivered,
      cancelled,

      averageOrder,
    });

    setLowStockProducts(lowStock);

    setRecentOrders(recent);
  }

  useEffect(() => {
  loadDashboardData();

  function handleStorageChange() {
    loadDashboardData();
  }

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

  return (
    <div className="admin-dashboard">
      {/* ==================================
          HEADER
      =================================== */}

      <div className="admin-page-heading">
        <div>
          <h2>Dashboard</h2>

          <p>Overview of your TechZone store.</p>
        </div>
      </div>

      {/* ==================================
          MAIN STATISTICS
      =================================== */}

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="stat-icon">📦</div>

          <div>
            <p>Total Products</p>

            <h2>{data.products}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <p>Total Users</p>

            <h2>{data.users}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">🛒</div>

          <div>
            <p>Total Orders</p>

            <h2>{data.orders}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">💰</div>

          <div>
            <p>Total Revenue</p>

            <h2>Rs. {data.revenue.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* ==================================
          ORDER STATISTICS
      =================================== */}

      <div className="order-statistics">
        <h3>Order Statistics</h3>

        <div className="order-stat-grid">
          <div className="order-stat-card">
            <span>🟡</span>

            <div>
              <p>Placed</p>

              <strong>{data.placed}</strong>
            </div>
          </div>

          <div className="order-stat-card">
            <span>🔵</span>

            <div>
              <p>Processing</p>

              <strong>{data.processing}</strong>
            </div>
          </div>

          <div className="order-stat-card">
            <span>🚚</span>

            <div>
              <p>Shipped</p>

              <strong>{data.shipped}</strong>
            </div>
          </div>

          <div className="order-stat-card">
            <span>🟢</span>

            <div>
              <p>Delivered</p>

              <strong>{data.delivered}</strong>
            </div>
          </div>

          <div className="order-stat-card">
            <span>🔴</span>

            <div>
              <p>Cancelled</p>

              <strong>{data.cancelled}</strong>
            </div>
          </div>

          <div className="order-stat-card">
            <span>💵</span>

            <div>
              <p>Average Order</p>

              <strong>
                Rs. {Math.round(data.averageOrder).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================
          LOWER DASHBOARD
      =================================== */}

      <div className="dashboard-grid">
        {/* =================================
            RECENT ORDERS
        ================================== */}

        <section className="dashboard-section">
          <div className="section-heading">
            <h3>Recent Orders</h3>

            <span>Latest 5</span>
          </div>

          {recentOrders.length === 0 ? (
            <p className="dashboard-empty">No orders yet.</p>
          ) : (
            <div className="recent-orders">
              {recentOrders.map((order) => (
                <div className="recent-order" key={order.id}>
                  <div>
                    <strong>#{order.id}</strong>

                    <p>{order.customer?.name || "Customer"}</p>
                  </div>

                  <div>
                    <strong>
                      Rs. {Number(order.total || 0).toLocaleString()}
                    </strong>

                    <span>{order.status || "Placed"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =================================
            LOW STOCK
        ================================== */}

        <section className="dashboard-section">
          <div className="section-heading">
            <h3>Low Stock</h3>

            <span>5 or fewer</span>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="dashboard-empty">No low-stock products.</p>
          ) : (
            <div className="low-stock-list">
              {lowStockProducts.map((product) => (
                <div className="low-stock-item" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>

                    <p>{product.brand}</p>
                  </div>

                  <span
                    className={
                      product.stock === 0 ? "stock-danger" : "stock-warning"
                    }
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : `${product.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
