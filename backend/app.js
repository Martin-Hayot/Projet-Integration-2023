const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Aquarium = require('./models/aquarium');
const aquarium = require('./models/aquarium');

const adresseMongoDB = '';

mongoose.connect(adresseMongoDB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

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