require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimiter = require("./middleware/rate-limiter");
const { deserializeUser } = require("./middleware/auth");
const userRoute = require("./routes/User");
const authRoute = require("./routes/auth");
const aquariumDataRoute = require("./routes/Aquarium");
const measureRoute = require("./routes/Measure")
const diagnosticRoutes = require("./routes/Diagnostic")
const chemicalComponent = require("./routes/ChemicalComponent")
const notification = require('./routes/Notification')
const jwt = require("jsonwebtoken");

mongoose
	.connect(process.env.DATABASE_ACCESS)
	.then(() => {
		console.log("Database connected");
	})
	.catch((error) => {
		console.error("Error connecting to the database:", error);
	});

// Middleware pour vérifier le jeton d'accès
const verifyAccessToken = (req, res, next) => {
	const accessToken = req.cookies.accessToken;
  
	if (!accessToken) {
	  return res.status(401).json({ message: "Unauthorized" });
	}
  
	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
	  if (err) {
		return res.status(403).json({ message: "Invalid token" });
	  }
	  req.user = user;
	  next();
	});
  };
  
  
  /* Utilisez le middleware de vérification du jeton d'accès pour protéger certaines routes
  app.use("/api/protected-route", verifyAccessToken, (req, res) => {
	res.json({ message: "This is a protected route", user: req.user });
  });
  */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(deserializeUser);
app.use(rateLimiter);
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
  

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/aquarium/data", aquariumDataRoute);
app.use("/api/chemicalComponent", chemicalComponent);
app.use("/api/diagnostic", diagnosticRoutes)
app.use("/api/measureRoute", measureRoute)
app.use('/api/notification',notification)
app.use('/api/user', notification)


module.exports = app;
