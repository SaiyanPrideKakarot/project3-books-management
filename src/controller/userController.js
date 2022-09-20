// POST /login
// Allow an user to login with their email and password.
// On a successful login attempt return a JWT token contatining the userId, exp, iat. The response should be a JSON object like this
// If the credentials are incorrect return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
// Books API


const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken')


const isValid= (email)=>{
    regex=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return regex.test(email)
}

const isPassword = function (password){
    regex  = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return regex.test(password)
}



const userLogin = async (req,res) =>{
     
    let body = req.body
    let {email,password} = body

   if(Object.keys(body).length==0){
    res.status(400).send({status:false, msg:"Please Enter Email_ID And Password"})
   }

   if(!email){
    res.status(400).send({status:false, msg:"Please Enter Email_ID "})
   }
   if(!isValid(email)){
    res.status(400).send({status:false, msg:"Please Enter Valid Email_ID"})
   }
   
   let emailExist = await userModel.findOne({email:email})

   if(!emailExist){
    res.status(400).send({status:false, msg:"You Are Not Register, Please Try Again"})
   }


if(!password){
    res.status(400).send({status:false, msg:"Please Enter Email_ID "})
   }
   if(!isPassword(password)){
    res.status(400).send({status:false, msg:"Please Enter Valid Email_ID"})
   }
   
   let passwordCheck = await userModel.findOne({email:email,password:password})
   if(!passwordCheck){
    res.status(400).send({status:false, msg:"Wrong password, Please Try Again"})
   }

   let userId = passwordCheck._id

   let token = jwt.sign({
                    userId : userId._id
                        },"this is secret key",{expiresIn: '1500'})
     

    res.setHeader("x-api-token", token)  
    res.status(201).send({status:false, Data:token})                


}

module.exports = {userLogin}