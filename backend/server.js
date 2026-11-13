require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth");
const medicineRoutes = require("./src/routes/medicines");
const requestRoutes = require("./src/routes/requests");
const dashboardRoutes = require("./src/routes/dashboard");
const alertRoutes = require("./src/routes/alerts");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "MediWaste API" }));
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alerts", alertRoutes.router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`MediWaste API running on http://localhost:${PORT}`)))
  .catch(err => { console.error("MongoDB connection failed:", err.message); process.exit(1); });

module.exports = app;
