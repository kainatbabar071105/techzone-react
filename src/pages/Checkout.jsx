import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { API_URL } from "../config";

function Checkout() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    cartItems,
    clearCart,
    products,
    setProducts,
  } = useStore();

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "Cash on Delivery",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const shippingCost = cartItems.length > 0 ? 500 : 0;

  const grandTotal = subtotal + shippingCost;

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
  // PLACE ORDER
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    // ========================================
    // LOGIN CHECK
    // ========================================

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    // ========================================
    // USER ID CHECK
    // ========================================

    if (!user.id) {
      console.error("Current user:", user);

      alert(
        "Your user account is missing an ID. Please logout and login again."
      );

      return;
    }

    // ========================================
    // EMPTY CART CHECK
    // ========================================

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // ========================================
    // CUSTOMER VALIDATION
    // ========================================

    if (
      !formData.name.trim() ||
      !formData.phone.trim()
    ) {
      alert("Please enter your name and phone number.");
      return;
    }

    // ========================================
    // SHIPPING VALIDATION
    // ========================================

    if (
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      alert(
        "Please enter your complete shipping address and city."
      );

      return;
    }

    // ========================================
    // STOCK VALIDATION
    // ========================================

    for (const cartItem of cartItems) {
      const product = products.find(
        (item) => item.id === cartItem.id
      );

      if (!product) {
        alert(
          `${cartItem.name} is no longer available.`
        );

        return;
      }

      if (
        Number(product.stock || 0) <
        Number(cartItem.quantity || 0)
      ) {
        alert(
          `Only ${product.stock} units of ${product.name} are available.`
        );

        return;
      }
    }

    // ========================================
    // PREPARE ORDER ITEMS
    // ========================================

    const orderItems = cartItems.map((item) => ({
      productId: String(item.id),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || "",
    }));

    // ========================================
    // PREPARE ORDER DATA
    // ========================================

    const orderData = {
      userId: Number(user.id),

      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      },

      shippingAddress: {
        address: formData.address.trim(),
        city: formData.city.trim(),
      },

      items: orderItems,

      paymentMethod: formData.paymentMethod,

      subtotal: Number(subtotal),

      shippingCost: Number(shippingCost),

      total: Number(grandTotal),
    };

    // ========================================
    // DEBUG
    // ========================================

    console.log("========================================");
    console.log("TECHZONE ORDER");
    console.log("========================================");

    console.log("USER:", user);

    console.log("ORDER DATA:", orderData);

    console.log("TOTAL ITEMS:", totalItems);

    console.log("SUBTOTAL:", subtotal);

    console.log("SHIPPING:", shippingCost);

    console.log("GRAND TOTAL:", grandTotal);

    console.log("========================================");

    setIsSubmitting(true);

    try {
      // ======================================
      // SEND ORDER TO BACKEND
      // ======================================

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(orderData),
        }
      );

      // ======================================
      // READ SERVER RESPONSE
      // ======================================

      const data = await response.json();

      console.log("SERVER RESPONSE:", data);

      // ======================================
      // SERVER ERROR
      // ======================================

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to place order."
        );

        return;
      }

      // ======================================
      // CHECK CREATED ORDER
      // ======================================

      if (!data.order) {
        console.error(
          "Backend did not return created order:",
          data
        );

        alert(
          "Order was created, but order information could not be loaded."
        );

        return;
      }

      // ======================================
      // UPDATE PRODUCT STOCK
      // ======================================

      const updatedProducts = products.map(
        (product) => {
          const cartItem = cartItems.find(
            (item) => item.id === product.id
          );

          if (!cartItem) {
            return product;
          }

          return {
            ...product,

            stock:
              Number(product.stock || 0) -
              Number(cartItem.quantity || 0),
          };
        }
      );

      setProducts(updatedProducts);

      // ======================================
      // CLEAR CART
      // ======================================

      clearCart();

      // ======================================
      // GO TO ORDER CONFIRMATION
      // ======================================

      navigate("/order-confirmation", {
        state: {
          order: data.order,
        },
      });
    } catch (error) {
      console.error(
        "Place Order Error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the TechZone backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <main className="page-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>Checkout</h1>

          <h2>
            Your cart is empty 😔
          </h2>

          <button
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // CHECKOUT PAGE
  // ==========================================

  return (
    <main className="page-container">

      <h1>Checkout 💳</h1>

      <form
        onSubmit={handleSubmit}
        className="checkout-layout"
      >

        {/* =====================================
            CUSTOMER INFORMATION
        ====================================== */}

        <section className="checkout-form">

          <h2>Customer Information</h2>

          {/* FULL NAME */}

          <label htmlFor="name">
            Full Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* PHONE */}

          <label htmlFor="phone">
            Phone Number
          </label>

          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="03XX-XXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* ADDRESS */}

          <label htmlFor="address">
            Shipping Address
          </label>

          <textarea
            id="address"
            name="address"
            placeholder="Enter your complete address"
            value={formData.address}
            onChange={handleChange}
            rows="4"
            required
          />

          {/* CITY */}

          <label htmlFor="city">
            City
          </label>

          <input
            id="city"
            type="text"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
            required
          />

          {/* ===================================
              PAYMENT METHOD
          ==================================== */}

          <h2 className="payment-heading">
            Payment Method
          </h2>

          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={
                formData.paymentMethod ===
                "Cash on Delivery"
              }
              onChange={handleChange}
            />

            Cash on Delivery
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="Easypaisa"
              checked={
                formData.paymentMethod ===
                "Easypaisa"
              }
              onChange={handleChange}
            />

            Easypaisa
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="JazzCash"
              checked={
                formData.paymentMethod ===
                "JazzCash"
              }
              onChange={handleChange}
            />

            JazzCash
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="Bank Transfer"
              checked={
                formData.paymentMethod ===
                "Bank Transfer"
              }
              onChange={handleChange}
            />

            Bank Transfer
          </label>

        </section>

        {/* =====================================
            ORDER SUMMARY
        ====================================== */}

        <aside className="checkout-summary">

          <h2>Order Summary</h2>

          {/* CHECKOUT ITEMS */}

          <div className="checkout-items">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="checkout-item"
              >

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <p>
                    {item.quantity} × Rs.{" "}
                    {Number(
                      item.price
                    ).toLocaleString()}
                  </p>

                </div>

                <strong>
                  Rs.{" "}
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString()}
                </strong>

              </div>
            ))}

          </div>

          <hr />

          {/* TOTAL ITEMS */}

          <div className="summary-row">

            <span>
              Total Items
            </span>

            <strong>
              {totalItems}
            </strong>

          </div>

          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              Rs.{" "}
              {subtotal.toLocaleString()}
            </strong>

          </div>

          {/* SHIPPING */}

          <div className="summary-row">

            <span>
              Shipping
            </span>

            <strong>
              Rs.{" "}
              {shippingCost.toLocaleString()}
            </strong>

          </div>

          <hr />

          {/* GRAND TOTAL */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              Rs.{" "}
              {grandTotal.toLocaleString()}
            </strong>

          </div>

          {/* PLACE ORDER */}

          <button
            type="submit"
            className="checkout-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Placing Order..."
              : "✅ Place Order"}
          </button>

        </aside>

      </form>

    </main>
  );
}

export default Checkout;
