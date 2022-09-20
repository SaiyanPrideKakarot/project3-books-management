const express = require('express')
const router = express.Router()

const BookController = require('../controller/bookController')

router.post("/books", BookController.createBooks)

module.exports = router