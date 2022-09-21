const express = require('express')
const router = express.Router()
const usercontroller = require ("../controller/usercontroller")

// require//
const userController = require("../controller/userController")
const BookController = require('../controller/bookController')

router.post ("/register",usercontroller.createuser)




router.post("/login",userController.userLogin)
router.post("/books", BookController.createBooks)

module.exports = router