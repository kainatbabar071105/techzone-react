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
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("========================================");
    console.log("✅ MongoDB Connected:", mongoose.connection.host);
    console.log("✅ Database Name:", mongoose.connection.name);
    console.log("========================================");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
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
// START SERVER (Local Development)
// ========================================
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 TechZone server running on port ${PORT}`);
  });
}

// ========================================
// EXPORT FOR VERCEL (Serverless)
// ========================================
export default app;