import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD USER ORDERS FROM MONGODB
  // ==========================================

  const loadOrders = useCallback(async () => {
    // ------------------------------------------
    // USER CHECK
    // ------------------------------------------

    if (!user || !user.id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ----------------------------------------
      // FETCH ORDERS FROM BACKEND
      // ----------------------------------------

      const response = await fetch(`http://localhost:5000/api/orders/user/${user.id}`)

      const data = await response.json();

      // ----------------------------------------
      // HANDLE API ERROR
      // ----------------------------------------

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders.",
        );
      }

      // ----------------------------------------
      // SAVE ORDERS
      // ----------------------------------------

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Load Orders Error:", error);

      setError(
        error.message ||
          "Unable to load your orders.",
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ==========================================
  // LOAD ORDERS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ==========================================
  // REFRESH WHEN USER RETURNS TO PAGE
  // ==========================================

  useEffect(() => {
    function handleFocus() {
      loadOrders();
    }

    window.addEventListener(
      "focus",
      handleFocus,
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus,
      );
    };
  }, [loadOrders]);
// ==========================================
// DELETE ORDER
// ==========================================

async function handleDeleteOrder(orderId) {

  // ========================================
  // USER CHECK
  // ========================================

  if (!user || !user.id) {

    alert(
      "Please login again to delete your order.",
    );

    return;
  }

  // ========================================
  // CONFIRM DELETE
  // ========================================

  const confirmed = window.confirm(
    "Are you sure you want to delete this order? This action cannot be undone.",
  );

  if (!confirmed) {
    return;
  }

  try {

    // ======================================
    // DELETE REQUEST
    // ======================================

    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}?userId=${user.id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    // ======================================
    // HANDLE ERROR
    // ======================================

    if (!response.ok) {

      throw new Error(
        data.message ||
          "Failed to delete order.",
      );
    }

    // ======================================
    // UPDATE UI
    // ======================================

    setOrders((previousOrders) =>
      previousOrders.filter(
        (order) =>
          order._id !== orderId,
      ),
    );

    alert(
      "Order deleted successfully.",
    );

  } catch (error) {

    console.error(
      "Delete Order Error:",
      error,
    );

    alert(
      error.message ||
        "Unable to delete the order.",
    );
  }
}
  // ==========================================
  // ORDER STATUS
  // ==========================================

  const statusSteps = [
    {
      key: "Pending",
      icon: "🕐",
      label: "Order Placed",
    },

    {
      key: "Confirmed",
      icon: "✓",
      label: "Confirmed",
    },

    {
      key: "Processing",
      icon: "⚙️",
      label: "Processing",
    },

    {
      key: "Shipped",
      icon: "🚚",
      label: "Shipped",
    },

    {
      key: "Delivered",
      icon: "✅",
      label: "Delivered",
    },
  ];

  // ==========================================
  // GET STATUS INDEX
  // ==========================================

  function getStatusIndex(status) {
    const index = statusSteps.findIndex(
      (step) => step.key === status,
    );

    return index === -1 ? 0 : index;
  }

  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(date) {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString(
      "en-PK",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    );
  }

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <main className="page-container">
        <div className="empty-products">
          <div className="empty-cart-icon">
            📦
          </div>

          <h1>Loading Orders...</h1>

          <p>
            Please wait while we load your
            orders.
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <main className="page-container">
        <div className="empty-products">
          <div className="empty-cart-icon">
            ⚠️
          </div>

          <h1>Unable to Load Orders</h1>

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
  // EMPTY ORDERS
  // ==========================================

  if (orders.length === 0) {
    return (
      <main className="page-container">
        <div className="empty-products">
          <div className="empty-cart-icon">
            📦
          </div>

          <h1>No Orders Yet</h1>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link to="/">
            <button className="primary-button">
              Start Shopping
            </button>
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // ORDERS PAGE
  // ==========================================

  return (
    <main className="page-container">
      <h1>My Orders 📦</h1>

      <p className="orders-subtitle">
        Track and manage your order history
      </p>

      <div className="orders-list">
        {orders.map((order) => {
          const currentStatus =
            order.status || "Pending";

          const currentIndex =
            getStatusIndex(currentStatus);

          const isCancelled =
            currentStatus === "Cancelled";

          return (
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
                  className={`order-status order-status-${currentStatus.toLowerCase()}`}
                >
                  {currentStatus}
                </span>
              </div>

              {/* =================================
                  DATE
              ================================= */}

              <p className="order-date">
                {formatDate(order.createdAt)}
              </p>

              {/* =================================
                  STATUS TRACKER
              ================================= */}

              {isCancelled ? (
                <div className="cancelled-order">
                  <div className="cancelled-icon">
                    ❌
                  </div>

                  <div>
                    <strong>
                      Order Cancelled
                    </strong>

                    <p>
                      This order has been
                      cancelled.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="order-tracker">
                  {statusSteps.map(
                    (step, index) => {
                      const isCompleted =
                        index <= currentIndex;

                      const isCurrent =
                        index ===
                        currentIndex;

                      return (
                        <div
                          key={step.key}
                          className={`tracking-step ${
                            isCompleted
                              ? "completed"
                              : ""
                          } ${
                            isCurrent
                              ? "current"
                              : ""
                          }`}
                        >
                          <div className="tracking-icon">
                            {step.icon}
                          </div>

                          <span>
                            {step.label}
                          </span>

                          {index <
                            statusSteps.length -
                              1 && (
                            <div
                              className={`tracking-line ${
                                index <
                                currentIndex
                                  ? "completed"
                                  : ""
                              }`}
                            />
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              {/* =================================
                  ORDERED PRODUCTS
              ================================= */}

              <div className="order-products">
                <h3>
                  Ordered Products
                </h3>

                {order.items?.map(
                  (item) => (
                    <div
                      key={item._id}
                      className="order-product"
                    >
                      {/* PRODUCT IMAGE */}

                      <div className="order-product-image">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                          />
                        ) : (
                          <span>
                            📱
                          </span>
                        )}
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="order-product-info">
                        <strong>
                          {item.name}
                        </strong>

                        <p>
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <p>
                          Rs.{" "}
                          {Number(
                            item.price,
                          ).toLocaleString()}
                          {" "}each
                        </p>
                      </div>

                      {/* ITEM TOTAL */}

                      <strong>
                        Rs.{" "}
                        {(
                          Number(item.price) *
                          Number(
                            item.quantity,
                          )
                        ).toLocaleString()}
                      </strong>
                    </div>
                  ),
                )}
              </div>

              {/* =================================
                  CUSTOMER / PAYMENT INFO
              ================================= */}

              <div className="order-information">
                <div>
                  <span>
                    Delivery City
                  </span>

                  <strong>
                    {
                      order.shippingAddress
                        ?.city
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {
                      order.paymentMethod ||
                      "N/A"
                    }
                  </strong>
                </div>
              </div>

              {/* =================================
                  SHIPPING ADDRESS
              ================================= */}

              <div className="order-information">
                <div>
                  <span>
                    Customer
                  </span>

                  <strong>
                    {
                      order.customer?.name ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Phone
                  </span>

                  <strong>
                    {
                      order.customer?.phone ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Shipping Address
                  </span>

                  <strong>
                    {
                      order.shippingAddress
                        ?.address ||
                      "N/A"
                    }
                  </strong>
                </div>
              </div>

              {/* =================================
                  ORDER TOTALS
              ================================= */}

              <div className="order-card-footer">

  <span>

    {order.items?.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0),
      0,
    )}{" "}

    items

  </span>

  <strong>

    Total: Rs.{" "}

    {Number(
      order.total || 0,
    ).toLocaleString()}

  </strong>

</div>


{/* =================================
    DELETE ORDER
================================= */}

{currentStatus === "Pending" && (
  <div className="order-actions">

    <button
      className="delete-order-button"
      onClick={() =>
        handleDeleteOrder(order._id)
      }
    >
      🗑️ Delete Order
    </button>

  </div>
)}
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Orders;
