const BookModel = require('../Models/bookModel')
const UserModel = require('../Models/userModel')
const mongoose = require('mongoose')


const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidString = function (data) {
    if (typeof data !== 'string'|| data.trim().length ==0) {
        return false
    } 
        return true
    
}

const isValidFormat = new RegExp(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)


const createBooks = async function(req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) {
            return res.status(400).send({status: false, message: "Please enter Books Details"})
        }
        let {title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt} = data
        let createBook = {}
        if (!isValidString(title)) {
            return res.status(400).send({status: false, message: "Title must be string and cannot be empty"})
        }
        createBook.title = title
        if (!isValidString(excerpt)) {
            return res.status(400).send({status: false, message: "Excerpt must be string and cannot be empty"})
        }
        createBook.excerpt = excerpt
        if (!isValidObjectId(userId)) {
            return res.status(400).send({status: false, message: "Enter a Valid User Id"})
        }
        createBook.userId = userId
        if (!isValidString(ISBN)) {
            return res.status(400).send({status: false, message: "ISBN must be string and cannot be empty"})
        }
        createBook.ISBN = ISBN
        if (!isValidString(category)) {
            return res.status(400).send({status: false, message: "Category must be string and cannot be empty"})
        }
        createBook.category = category
        if (!isValidString(subcategory)) {
            return res.status(400).send({status: false, message: "Subcategory must be string and cannot be empty"})
        }
        createBook.subcategory = subcategory
        if (reviews) {
            createBook.reviews = reviews
        }
        if (releasedAt) {
            if (!isValidFormat) {
                return res.status(400).send({status: false, message: "Please enter Released Date in valid format i.e. YYYY-MM-DD"})
            }
            createBook.releasedAt = releasedAt
        }
        let findId = await UserModel.findById(userId)
        if (!findId) {
            return res.status(404).send({status: false, message: "User not found"})
        }
        let savedData = await BookModel.create(createBook)
        return res.status(201).send({status: true, message: "Book created susseccfully", data: savedData})
    } catch (error) {
        console.log(error)
        return res.status(500).send({status: false, message: error.message})
    }
}


module.exports.createBooks = createBooks