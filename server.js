const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

require("dotenv").config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const driveRoutes = require("./routes/driveRoutes");

const app = express();

connectDB();

/* SECURITY */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(compression());

app.use(cors({
  origin: "*", // change after frontend deploy
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});

app.use(limiter);

/* BODY */
app.use(express.json());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Backend API is running");
});
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/drive", driveRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


module.exports = app;