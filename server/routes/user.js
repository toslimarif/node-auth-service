const express = require("express");
const userCtrl = require("../controllers/user");

// Set up a Router
const router = express.Router();

// Set up Routes
router.route("/login").post(userCtrl.login);
router.route("/register").post(userCtrl.register);

// Export the Router
module.exports = router;
