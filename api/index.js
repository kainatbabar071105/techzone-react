import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "../server/routes/OrderRoutes.js";

dotenv.config({ path: "server/.env" });

const app = express();

// CORS
app.use(cors({
  origin: [
    'https://techzone-react.vercel.app',
    'https://techzone-react-sand.vercel.app',
    'https://techzone-react-kappa.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
let connectionPromise;

const connectDB = () => {
  if (!process.env.MONGO_URI) {
    const error = new Error("MONGO_URI is not configured");
    console.error("❌ MongoDB Connection Error:", error.message);
    return Promise.reject(error);
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then(() => {
        console.log("✅ MongoDB Connected");
      })
      .catch((error) => {
        connectionPromise = undefined;
        console.error("❌ MongoDB Connection Error:", error.message);
        throw error;
      });
  }

  return connectionPromise;
};
connectDB().catch(() => {});

// ROOT ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TechZone API is running 🚀",
  });
});

// HEALTH CHECK
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      status: "ok",
      mongoDB: "Connected",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "error",
      mongoDB: "Disconnected",
      error: error.message,
    });
  }
});

// API DOCUMENTATION
app.get("/docs", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TechZone API documentation",
    endpoints: {
      health: "/api/health",
      orders: "/api/orders",
      userOrders: "/api/orders/user/:userId",
    },
  });
});

app.use("/api/orders", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Database unavailable",
      error: error.message,
    });
  }
});

app.use("/api/orders", orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// EXPORT FOR VERCEL
export default app;
