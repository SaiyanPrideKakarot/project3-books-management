const express = require('express')
const router = express.Router()


const userController = require("../Controllers/userController")
const BookController = require('../Controllers/bookController')


router.post("/register",userController.createuser)
router.post("/login",userController.userLogin)
router.post("/books", BookController.createBooks)
router.get("/books", BookController.getBooksByQuery)
router.get("/books/:bookId", BookController.getBookFromPath)

module.exports = router