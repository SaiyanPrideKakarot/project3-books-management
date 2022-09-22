const BookModel = require('../Models/bookModel')
const UserModel = require('../Models/userModel')
const mongoose = require('mongoose')
const reviewmodel = require('../Models/reviewmodel')




const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidString = function (data) {
    if (typeof data !== 'string' || data.trim().length == 0) {
        return false
    }
    return true

}

const isISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

const isValidFormat = RegExp(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)


const createBooks = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Please enter Books Details" })
        }
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = data
        let createBook = {}

        if (!title) {
            return res.status(400).send({ status: false, message: "Please Enter Title" })
        }
        if (!isValidString(title)) {
            return res.status(400).send({ status: false, message: "Title must be string and cannot be empty" })
        }
        let titleUnique = await BookModel.findOne({ title: title })
        if (titleUnique) {
            return res.status(400).send({ status: false, message: "Title Already Exist" })
        }
        createBook.title = title

        if (!excerpt) {
            return res.status(400).send({ status: false, message: "Please Enter  excerpt" })
        }
        if (!isValidString(excerpt)) {
            return res.status(400).send({ status: false, message: "Excerpt must be string and cannot be empty" })
        }
        createBook.excerpt = excerpt

        if (!userId) {
            return res.status(400).send({ status: false, message: "Please Enter userID" })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter a Valid User Id" })
        }
        let findId = await UserModel.findById(userId)
        if (!findId) {
            return res.status(404).send({ status: false, message: "User not found" })
        }
        createBook.userId = userId



        if (!ISBN) {
            return res.status(400).send({ status: false, message: "Please Enter ISBN" })
        }
        if (!isValidString(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN must be string and cannot be empty" })
        }
        if (!isISBN.test(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN msut contain only 13 Number" })
        }
        let checkIsbn = await BookModel.findOne({ ISBN: ISBN })
        if (checkIsbn) {
            return res.status(400).send({ status: false, message: "ISBN should be Unique" })
        }

        createBook.ISBN = ISBN

        if (!category) {
            return res.status(400).send({ status: false, message: "Please Enter Category" })
        }
        if (!isValidString(category)) {
            return res.status(400).send({ status: false, message: "Category must be string and cannot be empty" })
        }

        createBook.category = category

        if (!subcategory) {
            return res.status(400).send({ status: false, message: "Please Enter SubCategory" })
        }
        if (!isValidString(subcategory)) {
            return res.status(400).send({ status: false, message: "Subcategory must be string and cannot be empty" })
        }
        createBook.subcategory = subcategory

        // if (reviews) {
        //      createBook.reviews = reviews


        // }
        if (releasedAt) {
            if (!isValidFormat.test(releasedAt)) {
                return res.status(400).send({ status: false, message: "Please enter Released Date in valid format i.e. YYYY-MM-DD" })
            }
        }
        createBook.releasedAt = releasedAt


        let savedData = await BookModel.create(createBook)
        return res.status(201).send({ status: true, message: "Book created susseccfully", data: savedData })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getBooksByQuery = async function (req, res) {
    try {
        let bodyData = req.query
        if (Object.keys(bodyData).length === 0) {
            let allBooks = await BookModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

            return res.status(200).send({ status: false, message: "List of All Books", data: allBooks })
        } else {
            let { userId, category, subcategory } = bodyData
            let filter = {}
            if (userId) {
                if (!isValidObjectId(userId)) {
                    return res.status(400).send({ status: false, message: "Please provide a Valid User Id" })
                }
                filter.userId = userId
            }
            if (category) {
                if (!isValidString(category)) {
                    return res.status(400).send({ status: false, message: "Please provid category and it should be string" })
                }
                filter.category = category
            }
            if (subcategory) {
                if (!isValidString(subcategory)) {
                    return res.status(400).send({ status: false, message: "Please provid subcategory and it should be string" })
                }
                filter.subcategory = subcategory
            }
            filter.isDeleted = false
            if (Object.keys(filter).length > 3) {
                return res.status(400).send({ status: false, messgae: "Bad Request" })
            }

            if (userId || category || subcategory) {
                let getDataByFilter = await BookModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

                if (getDataByFilter.length === 0) {
                    return res.status(404).send({ status: false, message: "No books found by given query" })
                }
                return res.status(200).send({ status: false, message: "List of Books", data: getDataByFilter })
            }
            return res.status(400).send({ status: false, message: "Invalid entry in Query Params" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getBookFromPath = async function (req, res) {

    try {
        let bookID = req.params.bookId


        if (!isValidObjectId(bookID)) {
            res.status(400).send({ status: false, msg: "Please Enter Valid BookId" })
        }
        bookID.trim()

        //let review = await reviewmodel.find({})
        let searchBook = await BookModel.findOne({ bookid: bookID, isDeleted: false })

        if (!searchBook) {
            res.status(404).send({ status: false, msg: "Your BookId Not Found" })
        }

        res.status(201).send({ status: false, data: searchBook })



    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }
}



module.exports = { createBooks, getBooksByQuery, getBookFromPath }

