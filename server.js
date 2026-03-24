import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

// ✅ VERY IMPORTANT
app.use(cors({
  origin: "*",
  credentials: true
}));

// Middleware
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Basic health route
app.get("/", (req, res) => {
  res.send("Second Brain backend running 🚀");
});

// Protected test route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working 🎉",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

// CONNECT DB THEN START SERVER
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err.message);
  });
