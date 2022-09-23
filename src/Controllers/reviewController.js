// PUT /books/:bookId/review/:reviewId
// Update the review - review, rating, reviewer's name.
// Check if the bookId exists and is not deleted before updating the review. 
//Check if the review exist before updating the review. Send an error response with appropirate status code //
//like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Return the updated book document with reviews data on successful operation. 
//The response body should be in the form of JSON object like this
const mongoose = require("mongoose")
const ReviewModel = require("../Models/reviewModel")
const ObjectId = mongoose.Types.ObjectId
const BookModel = require("../Models/bookModel")










const isValid = function (value) {
    if (typeof value !== "string" || value.trim().length == 0) {
        return false
    } return true
}

const IsValidRating = function (rating) {
    if (rating < 1 || rating > 5) {
        return false
    } return true
}

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidString = function (data) {
    if (typeof data !== 'string' || data.trim().length == 0) {
        return false
    }
    return true
}




const reviewUpdate = async (req, res) => {

    try {
        // let url = req.url
        // console.log(url)
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
         
        let regex =  '/[^1-5]/g'

        
        if (rating) {
            if (!IsValidRating(rating)) {
                res.status(400).send({ status: false, msg: "Please Enter Valid Rating " })
            }
            if (!(regex.test(rating))) {
                res.status(400).send({status: false, message: "Ratings cannot be in decimals"})
            }
        }
        

        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                res.status(400).send({ status: false, msg: "Please Enter Valid  Name" })
            }
        }


        let updateReview = await ReviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, body)

        res.status(201).send({ status: true, data: updateReview })


    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}





const createReview = async function (req, res) {
    try {

        // let url = req.url.bookId
        // console.log(url)

        
        // if(url !== `/books/${ObjectId}/review`){
        //     return res.status(400).send({ status: false, message: "hello" })  
        // }
        bookIdInParams = req.params.bookId
        if (!isValidObjectId(bookIdInParams)) {
            return res.status(400).send({ status: false, message: "Please provid valid Book Id" })
        }
        let book = await BookModel.findOne({ _id: bookIdInParams, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "Book does not exists" })
        }
        let data = req.body
        if(Object.keys(data).length==0){
         return   res.status(400).send({status:false, msg:"Please Enter Details"})
    }
        let { bookId, reviewedBy, rating, review } = data
        
        if (!bookId) {
            data.bookId = bookIdInParams
        }
      
        if (!reviewedBy) {
            reviewedBy = "Kaise laga mera majak"
        }
        if (!isValidString(reviewedBy)) {
            return res.status(400).send({ status: false, message: "Reviewed By must be string and cannot be empty" })
        }


        let regex1 =  /^\d+$/

        if (!rating) {
            return res.status(400).send({ status: false, message: "Ratings is required" })
        }
        if (typeof (rating) !== "number") {
            return res.status(400).send({ status: false, message: "Ratings should be numbers only" })
        }
        if (rating < 1 || rating > 5 ) {
            return res.status(400).send({ status: false, message: "Ratings should be from 1 to 5" })
        }
        if(!regex1.test(rating)){
           return res.status(400).send({ status: false, message: "Ratings should  Not Be in Decimal" })
        }
        
        if (review) {
            if (!isValidString(review)) {
                return res.status(400).send({ status: false, message: "Review must be string and Not be empty" })
            }
        }
        data.reviewedAt = Date.now()
        let createdata = await ReviewModel.create(data)
        
        
        
        let reviewsdata = await ReviewModel.find({bookId:bookIdInParams, isDeleted: false})
        
        let count = reviewsdata.length
        let bookdetails = await BookModel.findOneAndUpdate({_id:bookIdInParams},{$set:{reviews:count}}).lean()
        bookdetails.reviewsData = reviewsdata
        console.log(bookdetails)
         
        return res.status(201).send({ status: true, message: "Success", data: bookdetails })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createReview, reviewUpdate }
