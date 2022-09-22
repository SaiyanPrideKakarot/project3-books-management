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

const IsValidRating = function(rating){
    if(rating < 0 || rating  > 5){
        return false
    }return true
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


module.exports = {reviewUpdate}
