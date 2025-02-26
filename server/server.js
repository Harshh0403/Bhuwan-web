const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// ✅ CORS Configuration (Only Allow Frontend Origin)
const corsOptions = {
  origin: "http://localhost:3000", // Adjust to match your frontend URL
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data parsing
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Stop the server if DB fails to connect
  });

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
  res.json({ message: "Server is running and MongoDB is connected!" });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("\n🔄 Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
