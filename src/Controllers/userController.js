const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken')

const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z ]{2,30}$/
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

const isMobile = function (phone) {
    regex = /^\d{10}$/
    return regex.test(phone)
}

const isValid = function (value) {
    if (typeof (value) !== "string" || value.trim().length == 0) {
        return false
    }
    return true
}



const createuser = async function (req, res) {

    try {

        let data = req.body
        let { title, name, phone, email, password, address } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: 'Please Enter Details in Request body' })
        }

        if (!title) {
            return res.status(400).send({ status: false, message: "Please Enter Title" })
        }

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Please Enter a Valid Title" })
        }

        let Title = ["Mr", "Miss", "Mrs"]
        if (!Title.includes(title)) {
            return res.status(400).send({ status: false, message: 'Title can be only Mr, Mrs, or Miss' })
        }



        if (!name) {
            return res.status(400).send({ status: false, message: "Please Enter Name" })
        }

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Name Must Be String And Cannot Be Empty' })
        }

        if (!isValidName(name)) {
            return res.status(400).send({ status: false, message: 'Please Enter Valid Name' })
        }
        name = name.trim().toLowerCase()


        if (!phone) {
            return res.status(400).send({ status: false, message: 'Please enter Mobile number' })
        }
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: 'Phone Number must be in string and cannot be empty' })
        }

        if (!isMobile(phone)) {
            return res.status(400).send({ status: false, message: 'Please Enter Valid Phone Number' })
        }

        let isUniquephone = await userModel.findOne({ phone: phone })
        if (isUniquephone) {
            return res.status(400).send({ status: false, message: 'Phone number already in use' })
        }


        if (!email) {
            return res.status(400).send({ status: false, message: 'Please provide email address' })
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Email must be in string and cannot be empty' })
        }

        if (!isEmail(email)) {
            return res.status(400).send({ status: false, message: 'Please enter valid email address' })
        }
        email = email.trim().toLowerCase()

        let isUniqueemail = await userModel.findOne({ email: email })
        if (isUniqueemail) {
            return res.status(400).send({ status: false, message: 'Email Id already exist' })
        }


        if (!password) {
            return res.status(400).send({ status: false, message: 'Please enter password' })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'Password must be in string and cannot be empty' })
        }

        if (!isPassword(password)) {
            return res.status(400).send({ status: false, message: 'Please enter valid password' })
        }


        if (address) {
            if (Object.prototype.toString.call(address) != "[object Object]") {
                return res.status(400).send({status: false, message: "Address should be of object type"})
            }
            if (Object.keys(address).length == 0) {
                return res.status(400).send({ status: false, message: "Please enter address Details" })
            }
            if (address.street) {
                if (!isValid(address.street)) {
                    return res.status(400).send({ status: false, message: "please provide vaild street" })
                }
                address.street = address.street.trim().toLowerCase()
            }
            if (address.city) {
                if (!isValid(address.city)) {
                    return res.status(400).send({ status: false, message: "please provide vaild city" })
                }
                address.city = address.city.trim().toLowerCase()
            }
            if (address.pincode) {
                if (!isValid(address.pincode)) {
                    return res.status(400).send({ status: false, message: "please provide vaild pincode" })
                }
            }
        }

        let obj = { title, name, email, address, password, phone }
        //validation end
        const newUser = await userModel.create(obj);
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
            return res.status(400).send({ status: false, message: "Please enter detail " })
        }

        if (!email) {
            return res.status(400).send({ status: false, message: "Please Enter Email_ID " })
        }
        if (!isEmail(email)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid Email_ID" })
        }

        let emailExist = await userModel.findOne({ email: email })

        if (!emailExist) {
            return res.status(400).send({ status: false, message: "You Are Not Registered, Please Try Again" })
        }



        if (!password) {
            return res.status(400).send({ status: false, message: "Please Enter Email_ID " })
        }
        if (!isPassword(password)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid Email_ID" })
        }

        let passwordCheck = await userModel.findOne({ email: email, password: password })
        if (!passwordCheck) {
            return res.status(400).send({ status: false, message: "Wrong password, Please Try Again" })
        }



        let userId = passwordCheck._id

        let token = jwt.sign({
            userId: userId._id
        }, "this is secret key", { expiresIn: '1500000' })


        res.setHeader("x-api-key", token)
        res.status(201).send({ status: true, message: "Success", Data: token })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}




module.exports.createuser = createuser
module.exports.userLogin = userLogin 