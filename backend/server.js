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

const MesureAquarium = require('./models/MesureAquarium')

const mesure1 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-01'),
  mesureTime: '10:25',
  mesureValue: 30
});

const mesure2 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-02'),
  mesureTime: '10:25',
  mesureValue: 28
});


const mesure3 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-03'),
  mesureTime: '10:25',
  mesureValue: 28
});


const mesure4 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-04'),
  mesureTime: '10:25',
  mesureValue: 25
});
const mesure5 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-05'),
  mesureTime: '10:25',
  mesureValue: 22
});

const mesure6 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-06'),
  mesureTime: '10:25',
  mesureValue: 40
});

const mesure7 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-07'),
  mesureTime: '10:25',
  mesureValue: 50
});

const mesure8 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-08'),
  mesureTime: '10:25',
  mesureValue: 48
});

const mesure9 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-9'),
  mesureTime: '10:25',
  mesureValue: 44
});
const mesure10 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-10'),
  mesureTime: '10:25',
  mesureValue: 28
});

const mesure11 = new MesureAquarium({
  mesureAquarium: '6525cb66651974a0c3d4c445',
  mesureComponent: '65261b9ce290ae1e41836858',
  mesureDate: new Date('2023-01-11'),
  mesureTime: '10:25',
  mesureValue: 28.5
});

mesure1.save();
mesure11.save();
mesure10.save();
mesure2.save();
mesure3.save();
mesure4.save();
mesure5.save();
mesure6.save();
mesure7.save();
mesure8.save();
mesure9.save();


//Middelware Fonction permettant d'avoir acces à la requête et sa réponse
app.use('/', routeUser);
app.use('/', routeAquarium);
app.use('/', routeChemicalComponent);
app.use('/', routeMesureAquarium);



app.listen(PORT, ()=>console.log(`Server is up and running ${PORT} `)) // Indique le port sur lequel on a la réponse