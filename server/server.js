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

// CORS - Frontend domains ko allow karein
app.use(cors({
  origin: [
    'https://techzone-react.vercel.app',
    'https://techzone-react-sand.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// ========================================
// MONGODB CONNECTION (Enhanced Error Logging)
// ========================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("========================================");
    console.log("✅ MongoDB Connected:", mongoose.connection.host);
    console.log("✅ Database Name:", mongoose.connection.name);
    console.log("========================================");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Keep the server running even if DB fails, so the test route still works
  }
};

connectDB();

// ========================================
// TEST ROUTE (Root Path)
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TechZone API is running 🚀",
    endpoints: {
      orders: "/api/orders",
      health: "/api/health"
    }
  });
});

// ========================================
// HEALTH CHECK ROUTE (For debugging)
// ========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    mongoDB: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    env: {
      NODE_ENV: process.env.NODE_ENV,
      MONGO_URI_EXISTS: !!process.env.MONGO_URI
    }
  });
});

// ========================================
// ORDER ROUTES
// ========================================

app.use("/api/orders", orderRoutes);

// ========================================
// CATCH-ALL ROUTE (404 Handler)
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ["/", "/api/health", "/api/orders"]
  });
});

// ========================================
// START SERVER (Local Development ONLY)
// ========================================

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 TechZone server running on port ${PORT}`);
  });
}

// ========================================
// EXPORT FOR VERCEL (CRUCIAL!)
// ========================================

export default app;