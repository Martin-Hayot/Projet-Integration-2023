const  express = require("express")
const router = express.Router()
const userController = require('../controllers/User')
const authentification = require('../middelware/authentification')

router.post('/createUser', userController.createUser);

router.post('/login', userController.login)

router.get('/showAllUsers', authentification, userController.showAllUsers)

router.get('/showOneUser', userController.ShowOneUser);

router.put('/modify/:id', userController.modifyUser);

router.delete('/delete/:id', authentification, userController.deleteUser);

module.exports = router