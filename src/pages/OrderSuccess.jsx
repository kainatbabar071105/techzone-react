
import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  const orderId = location.state?.orderId;

  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px",
      }}
    >
      <h1>🎉 Order Placed Successfully!</h1>

      <h2>Thank you for shopping with TechZone.</h2>

      {orderId && (
        <div>
          <h3>Your Order ID</h3>

          <h2>#{orderId}</h2>
        </div>
      )}

      <p>
        Your order has been received and will be processed soon.
      </p>

      <br />

      <Link to="/">
        <button>
          Continue Shopping 🛍️
        </button>
      </Link>
    </div>
  );
}

export default OrderSuccess;

