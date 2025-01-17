/** @format */

// Import express framework from node_modules
const express = require("express");

// Create a new instance of express (initialize express)
const app = express();

// Import the mongoose
const mongoose = require("mongoose");

// Import cors (Using cors)
const cors = require("cors");

// morgan is HTTP Request logger middleware for node.js
const morgan = require("morgan");

// Require dotenv(to manage secrets and configs)
// Using dotenv package to create environment variables
const dotenv = require("dotenv").config();

// Access Environment variables
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const PORT = process.env.PORT || 5000;

// Import Routes
const userRoutes = require("./routes/users");
const wishlistRoutes = require("./routes/wishlist");

// Connect mongoose to MongoDB.
// const mongoDB = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ii8vq.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;
const mongoDB = `mongodb://localhost:27017/media`;

mongoose
	.connect(mongoDB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() =>
		console.log("MongoDB database connection established successfully ..."),
	)
	.catch((error) => console.log("MongoDB connection error:", error));

// Log the request
app.use(morgan("dev"));

// Determine which domain can access the website
app.use(cors());

// Parses incoming requests with JSON payloads
app.use(express.json());

// Routes which Should handle the requests
app.use("/api/users", userRoutes);
app.use("/api/wishlists", wishlistRoutes);

// Home page API Endpoint (define the home page route)
app.get("/", (req, res) => {
	res.status(200).send({
		Message: "Welcome to My pmg-media Clone API",
	});
});

// Error Handling
// Handle error if the routes not found or there's any problem in DB connection
app.use((req, res, next) => {
	// Create an error and pass it to the next function
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

// An error handling middleware
app.use((error, req, res, next) => {
	res.status(error.status || 500).send({
		error: {
			Message: error.message,
		},
	});
});

module.exports = app;
