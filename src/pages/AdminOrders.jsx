import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ALL ORDERS
  // ==========================================

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/orders"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Load Admin Orders Error:", error);

      setError(
        error.message || "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadOrders();
  }, []);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  async function updateStatus(orderId, newStatus) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      // Update order locally
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );

      alert("Order status updated successfully.");
    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      alert(
        error.message ||
          "Failed to update order status."
      );
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="page-container">
        <h1>Admin Orders 📦</h1>

        <p>Loading orders...</p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="page-container">
        <h1>Admin Orders 📦</h1>

        <div className="error-message">
          <p>{error}</p>

          <button
            className="primary-button"
            onClick={loadOrders}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="page-container">
      <h1>Admin Orders 📦</h1>

      <p className="orders-subtitle">
        Manage all TechZone customer orders
      </p>

      {/* ========================================
          ORDER COUNT
      ======================================== */}

      <div className="admin-order-summary">
        <strong>
          Total Orders: {orders.length}
        </strong>
      </div>

      {/* ========================================
          EMPTY ORDERS
      ======================================== */}

      {orders.length === 0 ? (
        <div className="empty-products">
          <div className="empty-cart-icon">
            📦
          </div>

          <h2>No Orders Found</h2>

          <p>
            There are currently no customer orders.
          </p>
        </div>
      ) : (
        /* ========================================
           ORDERS LIST
        ======================================== */

        <div className="orders-list">
          {orders.map((order) => (
            <div
              key={order._id}
              className="order-card"
            >
              {/* =================================
                  HEADER
              ================================= */}

              <div className="order-card-header">
                <div>
                  <span>Order ID</span>

                  <strong>
                    #{order._id}
                  </strong>
                </div>

                <span
                  className={`order-status order-status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              {/* =================================
                  DATE
              ================================= */}

              <p className="order-date">
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>

              {/* =================================
                  CUSTOMER INFORMATION
              ================================= */}

              <div className="order-information">
                <div>
                  <span>Customer</span>

                  <strong>
                    {order.customer?.name ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>

                  <strong>
                    {order.customer?.phone ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <span>City</span>

                  <strong>
                    {order.shippingAddress
                      ?.city || "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Payment Method</span>

                  <strong>
                    {order.paymentMethod ||
                      "N/A"}
                  </strong>
                </div>
              </div>

              {/* =================================
                  ORDER ITEMS
              ================================= */}

              <div className="order-products">
                <h3>Ordered Products</h3>

                {order.items?.map(
                  (item, index) => (
                    <div
                      key={
                        item._id || index
                      }
                      className="order-product"
                    >
                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <p>
                          Quantity:{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <strong>
                        Rs.{" "}
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </strong>
                    </div>
                  )
                )}
              </div>

              {/* =================================
                  SHIPPING ADDRESS
              ================================= */}

              <div className="order-information">
                <div>
                  <span>
                    Shipping Address
                  </span>

                  <strong>
                    {
                      order.shippingAddress
                        ?.address
                    }
                  </strong>
                </div>

                <div>
                  <span>Postal Code</span>

                  <strong>
                    {
                      order.shippingAddress
                        ?.postalCode
                    }
                  </strong>
                </div>
              </div>

              {/* =================================
                  STATUS CONTROL
              ================================= */}

              <div className="admin-order-status">
                <label>
                  Update Order Status
                </label>

                <select
                  value={order.status}
                  onChange={(event) =>
                    updateStatus(
                      order._id,
                      event.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* =================================
                  FOOTER
              ================================= */}

              <div className="order-card-footer">
                <span>
                  {order.items?.reduce(
                    (sum, item) =>
                      sum +
                      Number(
                        item.quantity || 0
                      ),
                    0
                  )}{" "}
                  items
                </span>

                <strong>
                  Total: Rs.{" "}
                  {Number(
                    order.total || 0
                  ).toLocaleString()}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminOrders;