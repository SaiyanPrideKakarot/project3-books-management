const BookModel = require('../Models/bookModel')
const jwt = require('jsonwebtoken')


const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-Api-Token"]
        if (!token) {
            token = req.headers["x-api-token"]
        }
        if (!token) {
            return res.status(401).send({ status: false, message: "Token must be provided" })
        }
        let decodedToken = jwt.verify(token, "this is secret key")
        if (!decodedToken) {
            return res.status(401).send({ status: false, message: "Invalid Token" })
        }
        req.decodedToken = decodedToken
        res.setHeader("x-api-token", token)
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

const authorisation = async function (req, res, next) {
    try {
        let decoded = req.decodedToken
        let bookIdInParams = req.params.bookId
        if (bookIdInParams) {
            let userLoggedIn = decoded.UserId
            let book = await BookModel.findById(bookIdInParams)
            if (!book) {
                return res.status(404).send({ status: false, message: "Book Not found" })
            }
            const bookUserId = book.UserId.toString()
            if (userLoggedIn != bookUserId) {
                return res.status(403).send({ status: false, message: "You are not authorized user" })
            }
            next()
        }
        let userIdInBody = req.body.userId
        if (userIdInBody != userLoggedIn) {
            return res.status(403).send({status: false, message: "You are not authorized user"})
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {authentication, authorisation}