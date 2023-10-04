const  express = require("express")
const router = express.Router()
const personController = require('../controllers/Person')

router.post('/createPerson', personController.createPerson);

router.put('/modify/:id', personController.modifyPerson);

router.delete('/delete/:id', personController.deletePerson);

router.get('/showAllBand', bandCtrl.getBand)