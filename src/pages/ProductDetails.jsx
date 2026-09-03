import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";

function ProductDetails() {
  const { id } = useParams();

  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
  } = useStore();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================

  if (!product) {
    return (
      <main className="page-container">
        <div className="empty-products">
          <div className="empty-products-icon">
            😔
          </div>

          <h1>Product Not Found</h1>

          <p>
            The product you're looking for doesn't exist.
          </p>

          <Link to="/">
            <button className="primary-button">
              ← Back to Products
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const isLiked =
    wishlist?.some(
      (item) => item.id === product.id
    ) || false;

  const isOutOfStock = product.stock === 0;

  // ==========================================
  // QUANTITY
  // ==========================================

  function increaseQuantity() {
    if (quantity >= product.stock) {
      alert("Maximum available stock reached!");
      return;
    }

    setQuantity(quantity + 1);
  }

  function decreaseQuantity() {
    if (quantity <= 1) {
      return;
    }

    setQuantity(quantity - 1);
  }

  // ==========================================
  // ADD TO CART
  // ==========================================

  function handleAddToCart() {
    if (isOutOfStock) {
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setQuantity(1);
  }

  // ==========================================
  // PRODUCT DETAILS
  // ==========================================

  return (
    <main className="page-container">

      {/* BACK BUTTON */}

      <Link
        to="/"
        className="back-link"
      >
        ← Back to Products
      </Link>

      {/* PRODUCT DETAILS */}

      <div className="product-details">

        {/* ==================================
            PRODUCT IMAGE
        ================================== */}
<div className="product-image-box">

  {product.image ? (
    <img
      src={product.image}
      alt={product.name}
      className="product-detail-image"
    />
  ) : (
    <div className="product-detail-icon">
      📱
    </div>
  )}

</div>

        {/* ==================================
            PRODUCT INFORMATION
        ================================== */}

        <div className="product-info">

          {/* CATEGORY */}

          <p className="product-category">
            {product.category}
          </p>

          {/* NAME */}

          <h1>
            {product.name}
          </h1>

          {/* BRAND */}

          <p className="product-brand">
            Brand:{" "}
            <strong>
              {product.brand}
            </strong>
          </p>

          {/* PREMIUM BRAND */}

          {product.brand === "Apple" && (
            <div className="premium-badge">
              ⭐ Premium Brand
            </div>
          )}

          {/* PRICE */}

          <h2 className="details-price">
            Rs.{" "}
            {product.price.toLocaleString()}
          </h2>

          {/* STOCK */}

          <div
            className={
              isOutOfStock
                ? "stock-status out-of-stock"
                : "stock-status in-stock"
            }
          >
            {isOutOfStock
              ? "❌ Out of Stock"
              : `✅ ${product.stock} items available`}
          </div>

          <hr />

          {/* DESCRIPTION */}

          <h3>
            Product Description
          </h3>

          <p className="product-description">
            {product.description ||
              `Experience the latest technology with the ${product.name}. This product combines excellent performance, modern design and reliable quality.`}
          </p>

          {/* ==================================
              QUANTITY
          ================================== */}

          {!isOutOfStock && (
            <div className="quantity-section">

              <h3>
                Quantity
              </h3>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= product.stock
                  }
                >
                  +
                </button>

              </div>

            </div>
          )}

          {/* ==================================
              ACTIONS
          ================================== */}

          <div className="details-actions">

            {/* ADD TO CART */}

            <button
              type="button"
              className="cart-button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock
                ? "Out of Stock"
                : `🛒 Add ${quantity} To Cart`}
            </button>

            {/* WISHLIST */}

            <button
              type="button"
              className={`wishlist-button ${
                isLiked
                  ? "wishlist-active"
                  : ""
              }`}
              onClick={() =>
                toggleWishlist(product)
              }
            >
              {isLiked
                ? "❤️ Remove Wishlist"
                : "🤍 Add Wishlist"}
            </button>

            {/* VIEW CART */}

            <Link to="/cart">
              <button
                type="button"
                className="secondary-button"
              >
                View Cart
              </button>
            </Link>

          </div>

          {/* ==================================
              PRODUCT FEATURES
          ================================== */}

          <div className="product-features">

            <div>
              <strong>
                🚚 Delivery
              </strong>

              <span>
                Fast delivery available
              </span>
            </div>

            <div>
              <strong>
                🔒 Secure Shopping
              </strong>

              <span>
                Safe and secure checkout
              </span>
            </div>

            <div>
              <strong>
                ↩️ Easy Returns
              </strong>

              <span>
                Customer-friendly return policy
              </span>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;