import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useStore();

  // ==========================================
  // CART CALCULATIONS
  // ==========================================

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // Fixed shipping
  const shipping = cartItems.length > 0 ? 500 : 0;

  const grandTotal = subtotal + shipping;

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <main className="page-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link to="/" className="primary-button">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // CART
  // ==========================================

  return (
    <main className="page-container cart-page">

      {/* PAGE HEADER */}

      <div className="cart-page-header">
        <div>
          <h1>Shopping Cart 🛒</h1>

          <p>
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <Link to="/" className="continue-shopping top-shopping-link">
          ← Continue Shopping
        </Link>
      </div>

      <div className="cart-layout">

        {/* ==========================================
            CART ITEMS
        ========================================== */}

        <section className="cart-items">

          <div className="cart-header">
            <h2>Your Items</h2>

            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          {cartItems.map((item) => {

            const itemTotal =
              Number(item.price) * item.quantity;

            return (
              <div
                key={item.id}
                className="cart-item"
              >

                {/* PRODUCT */}

                <div className="cart-product">

                  <div className="cart-product-image">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.parentElement.classList.add(
                            "image-error"
                          );
                        }}
                      />
                    ) : (
                      <span>📱</span>
                    )}

                  </div>

                  <div className="cart-product-info">

                    <h3>{item.name}</h3>

                    {item.brand && (
                      <p className="cart-product-brand">
                        {item.brand}
                      </p>
                    )}

                    <p className="cart-product-price">
                      Rs. {Number(item.price).toLocaleString()}
                    </p>

                  </div>

                </div>

                {/* QUANTITY */}

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>

                </div>

                {/* ITEM TOTAL */}

                <div className="cart-item-total">

                  <strong>
                    Rs. {itemTotal.toLocaleString()}
                  </strong>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>
            );
          })}

        </section>

        {/* ==========================================
            ORDER SUMMARY
        ========================================== */}

        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>

            <strong>{totalItems}</strong>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>
              Rs. {subtotal.toLocaleString()}
            </strong>
          </div>

          <div className="summary-row">
            <span>Shipping</span>

            <strong>
              Rs. {shipping.toLocaleString()}
            </strong>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              Rs. {grandTotal.toLocaleString()}
            </strong>
          </div>

          <button
            type="button"
            className="checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout →
          </button>

          <Link
            to="/"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>

        </aside>

      </div>
    </main>
  );
}

export default Cart;