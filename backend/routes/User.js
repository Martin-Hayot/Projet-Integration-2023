const  express = require("express")
const router = express.Router()
const user = require('../controllers/User')
const authentification = require('../middelware/authentification')

router.post('/createUser', user.createUser);

router.post('/login', user.login)

router.get('/showAllUsers', authentification, user.showAllUsers)

router.get('/showOneUser', user.ShowOneUser);

router.put('/modify/:id', user.modifyUser);

router.delete('/delete/:id', authentification, user.deleteUser);

module.exports = router