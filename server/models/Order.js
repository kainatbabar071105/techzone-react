import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ========================================
    // USER ID
    // ========================================

    userId: {
      type: Number,
      required: true,
      index: true,
    },

    // ========================================
    // CUSTOMER
    // ========================================

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ========================================
    // SHIPPING ADDRESS
    // ========================================

    shippingAddress: {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // ========================================
    // ORDER ITEMS
    // ========================================

    items: [
      {
        productId: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        image: {
          type: String,
          default: "",
        },
      },
    ],

    // ========================================
    // PAYMENT
    // ========================================

    paymentMethod: {
      type: String,

      enum: [
        "Cash on Delivery",
        "Easypaisa",
        "JazzCash",
        "Bank Transfer",
      ],

      default: "Cash on Delivery",
    },

    // ========================================
    // PRICES
    // ========================================

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingCost: {
      type: Number,
      default: 500,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // ========================================
    // ORDER STATUS
    // ========================================

    status: {
      type: String,

      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],

      default: "Pending",
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);