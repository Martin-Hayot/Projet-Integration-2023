const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();


const PersonRoute = require("./routes/User");
const Aquarium = require('./models/aquarium');
const aquarium = require('./models/aquarium');

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
app.use("/api", PersonRoute);

app.post('/addDataAquarium', (req, res, next) => {
    const aquarium = new Aquarium({
        ...req.body
    });
    aquarium.save()
        .then(() => res.status(201).json({ message: 'Data enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

app.get('/getDataAquarium', (req, res, next) => {
    aquarium.find()
        .then(aquarium => res.status(200).json(aquarium))
        .catch(error => res.status(400).json({ error }));
});

module.exports = app;