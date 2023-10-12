const  express = require("express")
const router = express.Router()
const mesureAquarium = require('../controllers/MesureAquarium')
const authentification = require('../middelware/authentification')

router.post('/createMesureAquarium', mesureAquarium.createMesure);

router.get('/showAllUsers', authentification, mesureAquarium.showAllMesureAquarim)


router.delete('/delete/:id', authentification, mesureAquarium.deleteMesureAquarium);

module.exports = router