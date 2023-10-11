const  express = require("express")
const router = express.Router()
const aquariumController = require('../controllers/Aquarium')
const authentification = require('../middelware/authentification')

router.post('/createAquarium', aquariumController.createAquarium);

router.get('/showAllUsers', authentification, aquariumController.showAllAquarium)

//router.get('/showOneUser', aquariumController.ShowOneUser);

router.put('/modify/:id', aquariumController.modifyAquarium);

router.delete('/delete/:id', authentification, aquariumController.deleteAquarium);

module.exports = router