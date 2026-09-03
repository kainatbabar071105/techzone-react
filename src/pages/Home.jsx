import { useState } from "react";
import ProductGrid from "../components/common/ProductGrid";
import Hero from "../components/common/Hero";
import { useStore } from "../context/StoreContext";

function Home() {
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under300" &&
        product.price < 300000) ||
      (priceFilter === "300to400" &&
        product.price >= 300000 &&
        product.price <= 400000) ||
      (priceFilter === "above400" &&
        product.price > 400000);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice
    );
  });

  // ==========================================
  // SORT PRODUCTS
  // ==========================================

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => {
      if (sortOption === "priceLow") {
        return a.price - b.price;
      }

      if (sortOption === "priceHigh") {
        return b.price - a.price;
      }

      if (sortOption === "nameAZ") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    }
  );

  // ==========================================
  // DYNAMIC CATEGORIES
  // ==========================================

  const categories = [
    "All",
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceFilter("all");
    setSortOption("default");
  }

  // ==========================================
  // CHECK ACTIVE FILTERS
  // ==========================================

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "All" ||
    priceFilter !== "all" ||
    sortOption !== "default";

  return (
    <>
      {/* =====================================
          HERO
      ====================================== */}

      <Hero />

      <main className="page-container">

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <div className="products-page-header">
          <div>
            <span className="section-label">
              TECHZONE STORE
            </span>

            <h1>
              Find Your Perfect Tech 💻
            </h1>

            <p>
              Browse our latest smartphones and
              technology products.
            </p>
          </div>
        </div>

        {/* =====================================
            FILTER SECTION
        ====================================== */}

        <section className="filter-section">

          {/* SEARCH */}

          <div className="search-box">
            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by product, brand or category..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() =>
                  setSearchTerm("")
                }
              >
                ✕
              </button>
            )}
          </div>

          {/* FILTER HEADER */}

          <div className="filter-heading">
            <div>
              <h3>Filter Products</h3>

              <p>
                Narrow down your search
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear All
              </button>
            )}
          </div>

          {/* CATEGORY */}

          <div className="filter-group">
            <h4>Category</h4>

            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    selectedCategory === category
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* PRICE */}

          <div className="filter-group">
            <h4>Price Range</h4>

            <div className="filter-buttons">

              <button
                type="button"
                className={
                  priceFilter === "all"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setPriceFilter("all")
                }
              >
                All Prices
              </button>

              <button
                type="button"
                className={
                  priceFilter === "under300"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setPriceFilter("under300")
                }
              >
                Under Rs. 300K
              </button>

              <button
                type="button"
                className={
                  priceFilter === "300to400"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setPriceFilter("300to400")
                }
              >
                Rs. 300K - 400K
              </button>

              <button
                type="button"
                className={
                  priceFilter === "above400"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setPriceFilter("above400")
                }
              >
                Above Rs. 400K
              </button>

            </div>
          </div>

          {/* SORT */}

          <div className="filter-group">
            <h4>Sort By</h4>

            <div className="filter-buttons">

              <button
                type="button"
                className={
                  sortOption === "default"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setSortOption("default")
                }
              >
                Default
              </button>

              <button
                type="button"
                className={
                  sortOption === "priceLow"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setSortOption("priceLow")
                }
              >
                Price: Low → High
              </button>

              <button
                type="button"
                className={
                  sortOption === "priceHigh"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setSortOption("priceHigh")
                }
              >
                Price: High → Low
              </button>

              <button
                type="button"
                className={
                  sortOption === "nameAZ"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setSortOption("nameAZ")
                }
              >
                Name: A → Z
              </button>

            </div>
          </div>

        </section>

        {/* =====================================
            PRODUCTS HEADER
        ====================================== */}

        <div className="products-header">
          <div>
            <h2 id="products">
              Our Products
            </h2>

            <span className="products-count">
              {sortedProducts.length}{" "}
              {sortedProducts.length === 1
                ? "product"
                : "products"}{" "}
              found
            </span>
          </div>
        </div>

        {/* =====================================
            PRODUCTS
        ====================================== */}

        {sortedProducts.length === 0 ? (
          <div className="empty-products">

            <div className="empty-products-icon">
              🔍
            </div>

            <h2>
              No products found
            </h2>

            <p>
              Try changing your search or filters.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <ProductGrid
            products={sortedProducts}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        )}

      </main>
    </>
  );
}

export default Home;
