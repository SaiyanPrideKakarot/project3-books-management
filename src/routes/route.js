const express = require('express')
const router = express.Router()

// require//
const userController = require("../controller/userController")







router.post("/login",userController.userLogin)




module.exports = router