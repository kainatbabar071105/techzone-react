import mongoose from "mongoose";

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