import ProductCard from "./ProductCard";

function ProductGrid({
  products,
  addToCart,
  wishlist,
  toggleWishlist,
}) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      ))}
    </div>
  );
}

export default ProductGrid;