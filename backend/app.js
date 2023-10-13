const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const PersonRoute = require("./routes/user");
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
app.use(cors());

app.use("/api/user", PersonRoute);
app.use("/api/auth", authRoute);
app.use("/api/aquarium/data", aquariumDataRoute);

module.exports = app;
