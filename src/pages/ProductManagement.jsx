import { useState } from "react";
import { useStore } from "../context/StoreContext";

function ProductManagement() {
  const { products, setProducts } = useStore();

  // ==========================================
  // EMPTY FORM
  // ==========================================

  const emptyForm = {
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  };

  // ==========================================
  // STATES
  // ==========================================

  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // ==========================================
  // HANDLE IMAGE UPLOAD
  // ==========================================

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Allow only image files

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Maximum 2MB

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((previousData) => ({
        ...previousData,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  // ==========================================
  // ADD / UPDATE PRODUCT
  // ==========================================

  function handleSubmit(e) {
    e.preventDefault();

    // ========================================
    // VALIDATION
    // ========================================

    if (
      !formData.name.trim() ||
      !formData.brand.trim() ||
      !formData.category.trim() ||
      !formData.description.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      alert("Please fill all required fields.");

      return;
    }

    const price = Number(formData.price);

    const stock = Number(formData.stock);

    if (Number.isNaN(price) || price <= 0) {
      alert("Price must be greater than 0.");

      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      alert("Stock cannot be negative.");

      return;
    }

    // ========================================
    // UPDATE PRODUCT
    // ========================================

    if (editingId !== null) {
      const updatedProducts = products.map((product) => {
        if (product.id === editingId) {
          return {
            ...product,

            name: formData.name.trim(),

            brand: formData.brand.trim(),

            category: formData.category.trim(),

            description: formData.description.trim(),

            price,

            stock,

            image: formData.image.trim(),
          };
        }

        return product;
      });

      setProducts(updatedProducts);

      alert("Product updated successfully!");

      cancelEdit();

      return;
    }

    // ========================================
    // CREATE PRODUCT
    // ========================================

    const newProduct = {
      id: Date.now(),

      name: formData.name.trim(),

      brand: formData.brand.trim(),

      category: formData.category.trim(),

      description: formData.description.trim(),

      price,

      stock,

      image: formData.image.trim(),
    };

    setProducts((previousProducts) => [
      ...previousProducts,
      newProduct,
    ]);

    alert("Product added successfully!");

    setFormData(emptyForm);
  }

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  function handleEdit(product) {
    setEditingId(product.id);

    setFormData({
      name: product.name || "",

      brand: product.brand || "",

      category: product.category || "",

      description: product.description || "",

      price: product.price ?? "",

      stock: product.stock ?? "",

      image: product.image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  function cancelEdit() {
    setEditingId(null);

    setFormData(emptyForm);
  }

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  function handleDelete(productId) {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedProducts = products.filter(
      (item) => item.id !== productId
    );

    setProducts(updatedProducts);

    // Cancel editing if deleted product was open

    if (editingId === productId) {
      cancelEdit();
    }

    alert("Product deleted successfully!");
  }

  // ==========================================
  // STOCK STATUS
  // ==========================================

  function getStockStatus(stock) {
    if (stock === 0) {
      return "Out of Stock";
    }

    if (stock <= 5) {
      return "Low Stock";
    }

    return "In Stock";
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="product-management">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="admin-page-header">

        <div>
          <span className="section-label">
            INVENTORY
          </span>

          <h2>
            Product Management 📦
          </h2>

          <p>
            Add, update and manage your store products.
          </p>
        </div>

        <div className="admin-product-count">
          {products.length} Products
        </div>

      </div>

      {/* ========================================
          PRODUCT FORM
      ======================================== */}

      <section className="admin-dashboard-card">

        <div className="admin-card-header">

          <div>

            <h3>
              {editingId !== null
                ? "Edit Product ✏️"
                : "Add New Product ➕"}
            </h3>

            <p>
              {editingId !== null
                ? "Update the selected product."
                : "Enter product information below."}
            </p>

          </div>

        </div>

        <form
          className="admin-product-form"
          onSubmit={handleSubmit}
        >

          {/* PRODUCT NAME */}

          <div className="admin-form-group">

            <label>
              Product Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="e.g. iPhone 16 Pro Max"
              value={formData.name}
              onChange={handleChange}
            />

          </div>

          {/* BRAND */}

          <div className="admin-form-group">

            <label>
              Brand
            </label>

            <input
              type="text"
              name="brand"
              placeholder="e.g. Apple"
              value={formData.brand}
              onChange={handleChange}
            />

          </div>

          {/* CATEGORY */}

          <div className="admin-form-group">

            <label>
              Category
            </label>

            <input
              type="text"
              name="category"
              placeholder="e.g. Smartphone"
              value={formData.category}
              onChange={handleChange}
            />

          </div>

          {/* DESCRIPTION */}

          <div className="admin-form-group admin-description-group">

            <label>
              Product Description
            </label>

            <textarea
              name="description"
              placeholder="Write a detailed description of the product..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />

          </div>

          {/* PRICE */}

          <div className="admin-form-group">

            <label>
              Price (Rs.)
            </label>

            <input
              type="number"
              name="price"
              placeholder="e.g. 350000"
              min="1"
              value={formData.price}
              onChange={handleChange}
            />

          </div>

          {/* STOCK */}

          <div className="admin-form-group">

            <label>
              Stock
            </label>

            <input
              type="number"
              name="stock"
              placeholder="e.g. 10"
              min="0"
              value={formData.stock}
              onChange={handleChange}
            />

          </div>

          {/* ========================================
              PRODUCT IMAGE
          ======================================== */}

          <div className="admin-form-group admin-image-group">

            <label>
              Product Image
            </label>

            <p className="admin-image-help">
              Upload an image from your computer or paste an image URL.
            </p>

            {/* FILE UPLOAD */}

            <label className="image-upload-label">

              📁 Select Image

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-file-input"
              />

            </label>

            {/* OR */}

            <div className="image-or">
              <span>OR</span>
            </div>

            {/* IMAGE URL */}

            <input
              type="url"
              name="image"
              placeholder="https://example.com/product-image.jpg"
              value={
                formData.image.startsWith("data:")
                  ? ""
                  : formData.image
              }
              onChange={handleChange}
            />

            {/* IMAGE PREVIEW */}

            {formData.image && (

              <div className="admin-image-preview">

                <img
                  src={formData.image}
                  alt="Product preview"
                />

                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() =>
                    setFormData((previousData) => ({
                      ...previousData,
                      image: "",
                    }))
                  }
                >
                  🗑️ Remove Image
                </button>

              </div>

            )}

          </div>

          {/* BUTTONS */}

          <div className="admin-form-actions">

            <button
              type="submit"
              className="primary-button"
            >
              {editingId !== null
                ? "💾 Update Product"
                : "➕ Add Product"}
            </button>

            {editingId !== null && (

              <button
                type="button"
                className="secondary-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </section>

      {/* ========================================
          PRODUCTS TABLE
      ======================================== */}

      <section className="admin-dashboard-card">

        <div className="admin-card-header">

          <div>

            <h3>
              All Products
            </h3>

            <p>
              Manage your current inventory.
            </p>

          </div>

          <span>
            📦
          </span>

        </div>

        {products.length === 0 ? (

          <div className="admin-empty-state">

            <div>
              📦
            </div>

            <p>
              No products available.
            </p>

          </div>

        ) : (

          <div className="admin-products-table">

            {/* TABLE HEADER */}

            <div className="admin-product-table-header">

              <span>Product</span>

              <span>Brand</span>

              <span>Category</span>

              <span>Price</span>

              <span>Stock</span>

              <span>Actions</span>

            </div>

            {/* PRODUCT ROWS */}

            {products.map((product) => {

              const stockStatus = getStockStatus(
                Number(product.stock || 0)
              );

              return (

                <div
                  key={product.id}
                  className="admin-product-table-row"
                >

                  {/* PRODUCT */}

                  <div>

                    <strong>
                      {product.name}
                    </strong>

                  </div>

                  {/* BRAND */}

                  <span>
                    {product.brand}
                  </span>

                  {/* CATEGORY */}

                  <span>
                    {product.category}
                  </span>

                  {/* PRICE */}

                  <strong>
                    Rs.{" "}
                    {Number(
                      product.price || 0
                    ).toLocaleString()}
                  </strong>

                  {/* STOCK */}

                  <div>

                    <strong>
                      {product.stock}
                    </strong>

                    <small
                      className={`stock-status stock-${stockStatus
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {stockStatus}
                    </small>

                  </div>

                  {/* ACTIONS */}

                  <div className="admin-product-actions">

                    <button
                      type="button"
                      className="edit-button"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default ProductManagement;