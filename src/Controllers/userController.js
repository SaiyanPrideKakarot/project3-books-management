// POST /login
// Allow an user to login with their email and password.
// On a successful login attempt return a JWT token contatining the userId, exp, iat. The response should be a JSON object like this
// If the credentials are incorrect return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
// Books API


const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken')

const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)?$/
    return nameRegex.test(name)
}

const isEmail = (email) => {
    regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return regex.test(email)
}

const isPassword = function (password) {
    regex = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return regex.test(password)
}

const isValid = function (value) {
    if (typeof value !== 'string'|| value.trim().length ==0) {
        return false
    } 
        return true
}

const isValidPhone = function (phone) {
    let validPhone = /^((\+91)?|91)?[0-9]{10}$/;
    return validPhone.test(phone);
}



const createuser = async function (req, res) {

    try {

    let data = req.body 
    const {title, name, phone, email, password} = data;

    if (Object.keys(data)==0) {
        return res.status(400).send({ status :false , message :'No data provided' })
    }

    if (!isValid(title)) {
        return res.status(400).send({status : false ,message :"Title is required"})
    }

    if ((title !== "Mr") && (title !== "Mrs") && (title !== "Miss")) {
        return res.status(400).send({ status: false, msg: "Title should be Mr or Mrs or Miss only" })
    }

    if (!isValid(name)) {
        return res.status(400).send({ status: false, message: 'Name is required' })
    }
    if (!isValidName(name)) {
        return res.status(400).send({status: false, message: "Please enter a valid Name"})
    }

    if (!isValid(phone)) {
        return res.status(400).send({ status: false, message: 'Phone Number is required' })
    }
    if (!isValidPhone(phone)) {
        return res.status(400).send({status: false, message: "Please enter a valid Phone Number"})
    }

    let isUniquephone = await userModel.findOne({ phone: phone })
    if (isUniquephone) {
        return res.status(404).send({ status: false, message: 'Phone number already exist' })
    }

    if (!isValid(email)) {
        return res.status(400).send({ status: false, message: 'Email is required' })
    }
    if (!isEmail(email)) {
        return res.status(400).send({status: false, message: "Please enter a valid Email address"})
    }

    let isUniqueemail = await userModel.findOne({email: email})
    if (isUniqueemail) {
        return res.status(404).send({ status: false, message: 'Email Id already exist' })
    }

    if (!isValid(password)) {
        return res.status(400).send({ status: false, message: 'Password is required' })
    }

    if (password.length < 8 || password.length > 15) {
        return res.status(400).send({ status: false, message: 'Password should be of minimum 8 characters & maximum 15 characters' })
    }
    //validation end
    const newUser = await userModel.create(data);
    return res.status(201).send({ status: true, message: 'User successfully created', data: newUser })
}

 catch (error) {
    console.log(error)
    return res.status(500).send({ message: error.message })
}

}



const userLogin = async (req, res) => {

    try {
        let body = req.body
        let { email, password } = body

        if (Object.keys(body).length == 0) {
            res.status(400).send({ status: false, msg: "Please Enter Email_ID And Password" })
        }

        if (!email) {
            res.status(400).send({ status: false, msg: "Please Enter Email_ID " })
        }
        if (!isEmail(email)) {
            res.status(400).send({ status: false, msg: "Please Enter Valid Email_ID" })
        }

        let emailExist = await userModel.findOne({ email: email })

        if (!emailExist) {
            res.status(400).send({ status: false, msg: "You Are Not Register, Please Try Again" })
        }







        if (!password) {
            res.status(400).send({ status: false, msg: "Please Enter Email_ID " })
        }
        if (!isPassword(password)) {
            res.status(400).send({ status: false, msg: "Please Enter Valid Email_ID" })
        }

        let passwordCheck = await userModel.findOne({ email: email, password: password })
        if (!passwordCheck) {
            res.status(400).send({ status: false, msg: "Wrong password, Please Try Again" })
        }


        
        let userId = passwordCheck._id

        let token = jwt.sign({
            userId: userId._id
        }, "this is secret key", { expiresIn: '1500' })


        res.setHeader("x-api-token", token)
        res.status(201).send({ status: false, Data: token })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}






module.exports.createuser  =  createuser
module.exports.userLogin   =  userLogin 