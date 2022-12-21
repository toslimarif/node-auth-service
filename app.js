const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

// Set the Env Variables from .env
const dotenv = require("dotenv");

dotenv.config();

// Connect to the Database
const database = require("./server/config/database");

database.connect();

// Attach the Routes
const routes = require("./server/routes");

// Create an Express App
const app = express();

// Set up the CORS, allow all for now
app.use(cors());

// Log all responses to console
app.use(morgan("common"));

// Configure body parser
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Attach the routes here
app.use("/v1", routes);

module.exports = app;
