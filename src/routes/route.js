const express = require('express')
const router = express.Router()


const userController = require("../Controllers/userController")
const BookController = require('../Controllers/bookController')
const ReviewController = require('../Controllers/reviewController')
const Middleware = require('../Middlewares/middleware')


router.post("/register",userController.createuser)
router.post("/login",userController.userLogin)

router.post("/books", Middleware.authentication, Middleware.authorisation, BookController.createBooks)
router.get("/books", Middleware.authentication, BookController.getBooksByQuery)
router.get("/books/:bookId", Middleware.authentication, BookController.getBookFromPath)
router.put("/books/:bookId", Middleware.authentication, Middleware.authorisation, BookController.updateBooks)
router.delete("/books/:bookId", Middleware.authentication, Middleware.authorisation, BookController.deleteBooks)
router.post("/books/:bookId/review", Middleware.authentication, ReviewController.createReview)
router.put("/books/:bookId/review/:reviewId", Middleware.authentication, ReviewController.reviewUpdate)


module.exports = router