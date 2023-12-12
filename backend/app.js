require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const rateLimiter = require("./middleware/rate-limiter");
const { deserializeUser } = require("./middleware/auth");
const {
    userRoute,
    authRoute,
    aquariumRoute,
    ticketRoute,
    categoryRoute,
} = require("./routes");
const chemicalComponent = require('./routes/chemicalComponent');
const notifications = require('./routes/notification');

mongoose
    .connect(process.env.DATABASE_ACCESS)
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

app.use(cookieParser());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
app.use(deserializeUser);
app.use(rateLimiter);
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/ticket", ticketRoute);
app.use("/api/category", categoryRoute);
app.use("/api/aquarium", aquariumRoute);
app.use("/api/chemicalComponent", chemicalComponent);
//app.use("/api/report", report);
app.use("/api/notification",notifications);

module.exports = app;
