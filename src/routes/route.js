const express = require('express')
const router = express.Router()

// require//
const userController = require("../controller/userController")
const BookController = require('../controller/bookController')




router.post("/login",userController.userLogin)
router.post("/books", BookController.createBooks)

module.exports = router