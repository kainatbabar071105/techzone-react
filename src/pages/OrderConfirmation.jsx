import { Link, useLocation } from "react-router-dom";

function OrderConfirmation() {
  const location = useLocation();

  const order = location.state?.order;

  // ==========================================
  // ORDER NOT FOUND
  // ==========================================

  if (!order) {
    return (
      <main className="page-container">
        <div className="empty-products">
          <div className="empty-cart-icon">📦</div>

          <h1>Order Not Found</h1>

          <p>We couldn't find your order information.</p>

          <Link to="/">
            <button className="primary-button">Continue Shopping</button>
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // CALCULATE TOTAL ITEMS
  // ==========================================

  const totalItems =
    order.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    ) || 0;

  // ==========================================
  // FORMAT ORDER DATE
  // ==========================================

  function formatDate(date) {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  // ==========================================
  // ORDER VALUES
  // ==========================================

  const orderId = order._id || order.id || "N/A";

  const orderDate = formatDate(order.createdAt);

  const orderStatus = order.status || "Pending";

  const paymentMethod = order.paymentMethod || "N/A";

  const subtotal = Number(order.subtotal || 0);

  const shippingCost = Number(order.shippingCost || 0);

  const total = Number(order.total || 0);

  // ==========================================
  // CUSTOMER INFORMATION
  // ==========================================

  const customerName = order.customer?.name || "N/A";

  const customerPhone = order.customer?.phone || "N/A";

  const customerEmail = order.customer?.email || "";

  // ==========================================
  // SHIPPING INFORMATION
  // ==========================================

  const shippingCity = order.shippingAddress?.city || "N/A";

  const shippingAddress = order.shippingAddress?.address || "N/A";

  const postalCode = order.shippingAddress?.postalCode || "";

  // ==========================================
  // ORDER CONFIRMATION
  // ==========================================

  return (
    <main className="page-container">
      <div className="order-confirmation">
        {/* =====================================
            SUCCESS ICON
        ====================================== */}

        <div className="confirmation-icon">✅</div>

        {/* =====================================
            SUCCESS MESSAGE
        ====================================== */}

        <h1>Order Placed Successfully!</h1>

        <p className="confirmation-message">
          Thank you for shopping with TechZone. Your order has been received.
        </p>

        {/* =====================================
            ORDER ID
        ====================================== */}

        <div className="confirmation-order-id">
          <span>Order ID</span>

          <strong>#{orderId}</strong>
        </div>

        {/* =====================================
            ORDER DETAILS
        ====================================== */}

        <div className="confirmation-details">
          {/* ORDER DATE */}

          <div>
            <span>Order Date</span>

            <strong>{orderDate}</strong>
          </div>

          {/* STATUS */}

          <div>
            <span>Status</span>

            <strong>{orderStatus}</strong>
          </div>

          {/* TOTAL ITEMS */}

          <div>
            <span>Total Items</span>

            <strong>{totalItems}</strong>
          </div>

          {/* PAYMENT METHOD */}

          <div>
            <span>Payment Method</span>

            <strong>{paymentMethod}</strong>
          </div>
        </div>

        {/* =====================================
            ORDER SUMMARY
        ====================================== */}

        <section className="confirmation-summary">
          <h2>Order Summary</h2>

          <div className="confirmation-items">
            {order.items?.map((item, index) => {
              const itemTotal =
                Number(item.price || 0) * Number(item.quantity || 0);

              return (
                <div
                  key={item._id || item.productId || `${item.name}-${index}`}
                  className="confirmation-item"
                >
                  {/* PRODUCT IMAGE */}

                  <div className="confirmation-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name || "Product"} />
                    ) : (
                      <span>📱</span>
                    )}
                  </div>

                  {/* PRODUCT INFORMATION */}

                  <div className="confirmation-item-info">
                    <strong>{item.name || "Product"}</strong>

                    <p>Quantity: {Number(item.quantity || 0)}</p>

                    <p>
                      Rs. {Number(item.price || 0).toLocaleString("en-PK")} each
                    </p>
                  </div>

                  {/* ITEM TOTAL */}

                  <strong>Rs. {itemTotal.toLocaleString("en-PK")}</strong>
                </div>
              );
            })}
          </div>

          <hr />

          {/* SUBTOTAL */}

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>Rs. {subtotal.toLocaleString("en-PK")}</strong>
          </div>

          {/* SHIPPING */}

          <div className="summary-row">
            <span>Shipping</span>

            <strong>Rs. {shippingCost.toLocaleString("en-PK")}</strong>
          </div>

          <hr />

          {/* TOTAL */}

          <div className="summary-total">
            <span>Total</span>

            <strong>Rs. {total.toLocaleString("en-PK")}</strong>
          </div>
        </section>

        {/* =====================================
            DELIVERY INFORMATION
        ====================================== */}

        <section className="confirmation-customer">
          <h2>Delivery Information</h2>

          {/* NAME */}

          <p>
            <strong>Name:</strong> {customerName}
          </p>

          {/* PHONE */}

          <p>
            <strong>Phone:</strong> {customerPhone}
          </p>

          {/* EMAIL */}

          {customerEmail && (
            <p>
              <strong>Email:</strong> {customerEmail}
            </p>
          )}

          {/* CITY */}

          <p>
            <strong>City:</strong> {shippingCity}
          </p>

          {/* ADDRESS */}

          <p>
            <strong>Address:</strong> {shippingAddress}
          </p>

          {/* POSTAL CODE */}

          {postalCode && (
            <p>
              <strong>Postal Code:</strong> {postalCode}
            </p>
          )}
        </section>

        {/* =====================================
            ACTION BUTTONS
        ====================================== */}

        <div className="confirmation-actions">
          <Link to="/orders">
            <button className="primary-button">📦 View My Orders</button>
          </Link>

          <Link to="/">
            <button className="secondary-button">🛍️ Continue Shopping</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderConfirmation;
