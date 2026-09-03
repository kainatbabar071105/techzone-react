import { useStore } from "../context/StoreContext";

function Wishlist() {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
  } = useStore();

  return (
    <main className="page-container">
      <div className="wishlist-page">
        <h1>My Wishlist ❤️</h1>

        {wishlist.length === 0 ? (
          <div className="empty-products">
            <div className="empty-products-icon">❤️</div>

            <h2>Your wishlist is empty 😔</h2>

            <p>
              You haven't added any products to your wishlist yet.
            </p>
          </div>
        ) : (
          <div className="wishlist-list">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="wishlist-item"
              >
                <div className="wishlist-product">
                  <div className="wishlist-product-image">
                    💻
                  </div>

                  <div>
                    <h2>{product.name}</h2>

                    <p>Brand: {product.brand}</p>

                    <strong>
                      Rs. {Number(product.price).toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className="wishlist-actions">
                  <button
                    className="primary-button"
                    onClick={() => addToCart(product)}
                  >
                    Add To Cart 🛒
                  </button>

                  <button
                    className="remove-button"
                    onClick={() => toggleWishlist(product)}
                  >
                    ❤️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
