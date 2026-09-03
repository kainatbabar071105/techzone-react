import { Link } from "react-router-dom";

function ProductCard({
  product,
  addToCart,
  wishlist = [],
  toggleWishlist,
}) {
  const isLiked = wishlist.some(
    (item) => item.id === product.id
  );

  const isOutOfStock = product.stock === 0;

  return (
    <article className="product-card">

     <div className="product-card-image">

  {product.image ? (
    <img
      src={product.image}
      alt={product.name}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <div className="product-image-placeholder">
      📱
    </div>
  )}

</div>
      {/* PRODUCT HEADER */}

      <div className="product-card-header">

        <span className="product-category">
          {product.category}
        </span>

        {product.brand === "Apple" && (
          <span className="premium-badge">
            ⭐ Premium
          </span>
        )}

      </div>

      {/* PRODUCT NAME */}

      <h2 className="product-name">
        {product.name}
      </h2>

      {/* BRAND */}

      <p className="product-brand">
        <span>Brand</span>

        <strong>
          {product.brand}
        </strong>
      </p>

      {/* PRICE */}

      <div className="product-price">
        Rs. {product.price.toLocaleString()}
      </div>

      {/* STOCK */}

      <div
        className={
          isOutOfStock
            ? "product-stock out-of-stock"
            : "product-stock in-stock"
        }
      >

        <span>
          {isOutOfStock
            ? "● Out of Stock"
            : "● In Stock"}
        </span>

        {!isOutOfStock && (
          <small>
            {product.stock} available
          </small>
        )}

      </div>

      {/* ACTIONS */}

      <div className="product-actions">

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
            ? "❤️ Wishlisted"
            : "🤍 Wishlist"}
        </button>

        {/* CART */}

        <button
          type="button"
          className="cart-button"
          disabled={isOutOfStock}
          onClick={() =>
            addToCart(product)
          }
        >
          {isOutOfStock
            ? "Out of Stock"
            : "🛒 Add To Cart"}
        </button>

        {/* DETAILS */}

        <Link
          to={`/product/${product.id}`}
          className="details-link"
        >
          View Details →
        </Link>

      </div>

    </article>
  );
}

export default ProductCard;