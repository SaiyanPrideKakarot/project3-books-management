const mongoose = require("mongoose")
const ReviewModel = require("../Models/reviewModel")
const ObjectId = mongoose.Types.ObjectId
const BookModel = require("../Models/bookModel")


const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidString = function (data) {
    if (typeof data !== 'string' || data.trim().length == 0) {
        return false
    }
    return true
}

const isValid = function (value) {
    if (typeof value !== "string" || value.trim().length == 0) {
        return false
    } return true
}

const IsValidRating = function(rating){
    if(rating < 0 || rating  > 5){
        return false
    }return true
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

const reviewUpdate = async (req, res) => {

    try{let url = req.url
        console.log(url)
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
    
        if (!bookId) {
            res.status(400).send({ status: false, msg: "Please Enter BookId" })
        }
        if (!reviewId) {
            res.status(400).send({ status: false, msg: "Please Enter reviewId" })
        }
    
        if (!ObjectId.isValid(bookId)) {
            res.status(400).send({ status: false, msg: "Please Enter valid bookId" })
        }
        if (!ObjectId.isValid(reviewId)) {
            res.status(400).send({ status: false, msg: "Please Enter valid reviewId" })
        }
    
        let checkBookId = await BookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkBookId) {
            res.status(404).send({ status: false, msg: "BookID Not Valid" })
        }
    
        let checkReviewId = await ReviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
        if (!checkReviewId) {
            res.status(404).send({ status: false, msg: "ReviewID Not Valid" })
        }
    
        let body = req.body
        if (Object.keys(body).length == 0) {
            res.status(400).send({ status: false, msg: "Please Enter Details" })
        }
    
        const arr = ["review", "rating", "reviewedBy"]
        let key = (Object.keys(body))
    
        if ((!key.every(ele => arr.includes(ele)) || (key.length > 3))) {
            res.status(400).send({ status: false, msg: "Please Enter Valid Details" })
        }
    
        let { review, rating, reviewedBy } = body
    
    
    
        if (review) {
            if (!isValid(review)) {
                res.status(400).send({ status: false, msg: "Please Enter Valid review " })
            }
        }
    
        if (rating) {
            if (!IsValidRating(rating)) {
                res.status(400).send({ status: false, msg: "Please Enter Valid Rating " })
            }
        }
         
        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                res.status(400).send({ status: false, msg: "Please Enter Valid  Name" })
            }
        }
        
        
        let updateReview = await  ReviewModel.findOneAndUpdate({_id:reviewId,bookId:bookId},body)
          
        res.status(201).send({status:true, data:updateReview})
    
    
    }catch(err){
        res.status(500).send({status:false, Error:err.message})
    }  
    }  
    
    
module.exports = {createReview, reviewUpdate}
