const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Tell Express it’s behind a proxy (important for Render & express-rate-limit)
app.set("trust proxy", 1);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is working!");
});

// Import routes
const usersRoutes = require("./routes/users"); 
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");
const consultationRoutes = require("./routes/consultations");
const referralRoutes = require("./routes/referrals");
const invoiceRoutes = require("./routes/invoices");
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const complianceAlertRoutes = require("./routes/complianceAlerts");
const otpRoutes = require("./routes/otp");
const emailConfigRoutes = require("./routes/emailConfig");
const doctorRoutes = require("./routes/doctors");
const nurseRoutes = require("./routes/nurses");
const superAdminRoutes = require("./routes/superadmin");

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://ornate-kringle-eda7fb.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow requests with no origin
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log("❌ CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Healthcare Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ API routes
app.use("/api/users", usersRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/compliance-alerts", complianceAlertRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/email-config", emailConfigRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/nurses", nurseRoutes);
app.use("/api/superadmin", superAdminRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.statusCode || 500,
      timestamp: new Date().toISOString(),
    },
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI_PROD
        : process.env.MONGODB_URI;

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
      );
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});
