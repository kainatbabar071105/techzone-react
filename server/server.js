import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("========================================");
    console.log("MongoDB Connected:", mongoose.connection.host);
    console.log("Database Name:", mongoose.connection.name);
    console.log("MongoDB Port:", mongoose.connection.port);
    console.log("========================================");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });

// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TechZone API is running 🚀",
  });
});

// ========================================
// ORDER ROUTES
// ========================================

app.use("/api/orders", orderRoutes);

// ========================================
// START SERVER
// ========================================

app.listen(PORT, "127.0.0.1", () => {
  console.log(
    `TechZone server running at http://127.0.0.1:${PORT}`
  );
});