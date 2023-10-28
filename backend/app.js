const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const aquariumRoute = require("./routes/aquarium");
const aquariumDiagnosticRoute = require("./routes/diagnostic");
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

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/aquarium", aquariumRoute);
app.use("/api/aquarium/diagnostic", aquariumDiagnosticRoute);
app.use("/api/aquarium/data", aquariumDataRoute);

module.exports = app;
