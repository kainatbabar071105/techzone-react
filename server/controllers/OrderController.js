import Order from "../models/Order.js";

// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      customer,
      shippingAddress,
      items,
      paymentMethod,
      subtotal,
      shippingCost,
      total,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!customer || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer, shipping address and items are required",
      });
    }

    // ========================================
    // CREATE ORDER
    // ========================================

    const order = await Order.create({
      userId,
      customer,
      shippingAddress,
      items,
      paymentMethod,
      subtotal,
      shippingCost,
      total,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// ========================================
// GET ALL ORDERS
// ========================================

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ========================================
// GET SINGLE ORDER
// ========================================

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// ========================================
// GET MY ORDERS
// ========================================

export const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your orders",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE ORDER STATUS
// ========================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// ========================================
// DELETE ORDER
// ========================================

// ========================================
// DELETE ORDER
// ========================================

export const deleteOrder = async (req, res) => {
  try {
    const { userId } = req.query;

    // ========================================
    // VALIDATE USER ID
    // ========================================

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ========================================
    // FIND ORDER
    // ========================================

    const order = await Order.findById(
      req.params.id,
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ========================================
    // VERIFY ORDER OWNER
    // ========================================

    if (
      String(order.userId) !==
      String(userId)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this order",
      });
    }

    // ========================================
    // DELETE ORDER
    // ========================================

    await Order.findByIdAndDelete(
      req.params.id,
    );

    res.status(200).json({
      success: true,
      message:
        "Order deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Order Error:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete order",
      error: error.message,
    });
  }
};