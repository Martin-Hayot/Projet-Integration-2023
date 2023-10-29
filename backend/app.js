require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { deserializeUser } = require("./middleware/auth");
const userRoute = require("./routes/User");
const authRoute = require("./routes/auth");
const aquariumDataRoute = require("./routes/data");

mongoose
	.connect(process.env.DATABASE_ACCESS)
	.then(() => {
		console.log("Database connected");
	})
	.catch((error) => {
		console.error("Error connecting to the database:", error);
	});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(deserializeUser);
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/aquarium/data", aquariumDataRoute);

module.exports = app;
