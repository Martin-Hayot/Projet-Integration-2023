// Structure pour atteindre le serveur pour lancer les requêtes
const express = require('express')
const  app = express() // Création de l'application
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const cors = require('cors')
const bodyParser = require("express")
const path = require('path')
let PORT = process.env.PORT || 8080
const routeUser = require('./routes/User')
const routeAquarium = require('./routes/Aquarium')
const routeChemicalComponent = require('./routes/ChemicalComponent')
const routeMesureAquarium = require('./routes/MesureAquarium')

dotenv.config()
// AddUser de la base de donnée via le fichier .env
mongoose.connect(process.env.DATABASE_ACCESS)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });


app.use(express.json()) // Convertir les données au formats JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


//Middelware Fonction permettant d'avoir acces à la requête et sa réponse
app.use('/', routeUser);
app.use('/', routeAquarium);
app.use('/', routeChemicalComponent);
app.use('/', routeMesureAquarium);



app.listen(PORT, ()=>console.log(`Server is up and running ${PORT} `)) // Indique le port sur lequel on a la réponse