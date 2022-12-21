const express = require("express");
const helloCtrl = require("../controllers/hello");

// Set up a Router
const router = express.Router();

// Set up Routes
router.route("/").get(helloCtrl.hello);

// Export the Router
module.exports = router;
