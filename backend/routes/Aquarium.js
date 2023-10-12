const  express = require("express")
const router = express.Router()
const aquarium = require('../controllers/Aquarium')
const authentification = require('../middelware/authentification')

router.post('/createAquarium', aquarium.createAquarium);

router.get('/showAllUsers', authentification, aquarium.showAllAquarium)

//router.get('/showOneUser', aquariumController.ShowOneUser);

router.put('/modify/:id', aquarium.modifyAquarium);

router.delete('/delete/:id', authentification, aquarium.deleteAquarium);

module.exports = router