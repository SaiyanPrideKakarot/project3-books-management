const ReviewModel = require('../Models/reviewModel')
const mongoose = require('mongoose')
const BookModel = require('../Models/bookModel')

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidString = function (data) {
    if (typeof data !== 'string' || data.trim().length == 0) {
        return false
    }
    return true
}

const createReview = async function (req, res) {
    try {
        bookIdInParams = req.params.bookId
        if (!isValidObjectId(bookIdInParams)) {
            return res.status(400).send({status: false, message: "Please provid valid Book Id"})
        }
        let book = await BookModel.findOne({_id: bookIdInParams, isDeleted: false})
        if (!book) {
            return res.status(404).send({status: false, message: "Book does not exists"})
        }
        let data = req.body
        let {bookId, reviewedBy, reviewedAt, rating, review} = data
        if (!bookId) {
            return res.status(400).send({status: false, message: "BookId is required"})
        }
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({status: false, message: "Please provid valid Book Id"})
        }
        if (!book) {
            return res.status(404).send({status: false, message: "Book does not exists"})
        }
        if (!reviewedBy) {
            return res.status(400).send({status: false, message: "Reviewed By is required"})
        }
        if (!isValidString(reviewedBy)) {
            return res.status(400).send({status: false, message: "Reviewed By must be string and cannot be empty"})
        }
        if (!reviewedAt) {
            return res.status(400).send({status: false, message: "Reviewed Date is required"})
        }
        if (typeof(reviewedAt) !== Date) {
            return res.status(400).send({status: false, mesasage: "Enter valid Date"})
        }
        if (!rating) {
            return res.status(400).send({status: false, message: "Ratings is required"})
        }
        if (typeof(rating) !== Number) {
            return res.status(400).send({status: false, message: "Ratings should be numbers only"})
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({status: false, message: "Ratings should be from 1 to 5"})
        }
        if (review) {
            if (!isValidString(review)) {
                return res.status(400).send({status: false, message: "Review must be string"})
            }
        }
        let savedData = await ReviewModel.create(data)
        return res.status(201).send({status: true, message: "Success", data: data})
    } catch (error) {
        console.log(error)
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = {createReview}