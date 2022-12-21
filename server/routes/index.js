const express = require("express");
const { ok } = require("../statuses");

// Import the Middlewares
const auth = require("../middlewares/auth");

// Import All Routes Here
const userRoutes = require("./user");
const helloRoutes = require("./hello");

// Create a new Router
const router = express.Router();

// Utility to check API Up Status
router.get("/status", (req, res) =>
  res.status(ok).json({
    status: "OK",
    statusCode: ok,
    message: "API is Up and Healthy!",
    apiName: "Node Auth Service",
    version: "1.0",
    authType: "API Token",
  })
);

// Use those routes by attaching to the router
router.use("/user", userRoutes);
router.use("/hello", auth, helloRoutes);

// Export the Router
module.exports = router;
