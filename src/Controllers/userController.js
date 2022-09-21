const userModel = require ("../Models/userModel")

const isvalid = function (value) {
    if (typeof(value) === undefined || typeof (value) === null)  {return false}
    if (value.trim().length==0) {return false} {return false}
    if (typeof (value) === "string" && value.trim().length > 0) { return true }
}

const createuser = async function (req, res) {

    try {

    let data = req.body 
    const {title, name, phone, email, password} = data;

    if (Object.keys(data)==0) {return res.status(400).send({ status :false , message :'No data provided' })}

    if (!isvalid(title)) {return res.status(400).send({status : false ,message :"title is required"})}

    if (!(title.trim() == 'mr' || title.trim() == 'mrs')) {return res.status(400).send({status:false,message:'please provode appropriate title' })}

    if (!isValid(name)) { return res.status(400).send({ status: false, message: 'Name is required' }) }

    if (!isValid(phone)) { return res.status(400).send({ status: false, message: 'Phone Number is required' }) }

    //if (!isRightFormatphone(phone)) { return res.status(400).send({ status: false, message: 'Please provide a valid phone number' }) }

    let isUniquephone = await userModel.findOne({  })
    if (isUniquephone) { return res.status(400).send({ status: false, message: 'Phone number already exist' }) }

    if (!isValid(email)) { return res.status(400).send({ status: false, message: 'Email is required' }) }

   // if (!isRightFormatemail(email)) { return res.status(400).send({ status: false, message: 'Please provide a valid email' }) }

    let isUniqueemail = await userModel.findOne({ })
    if (isUniqueemail) { return res.status(400).send({ status: false, message: 'Email Id already exist' }) }

    if (!isValid(password)) { return res.status(400).send({ status: false, message: 'Password is required' }) }

    if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, message: 'Password should be of minimum 8 characters & maximum 15 characters' }) }
    //validation end
    const newUser = await userModel.create(data);
    return res.status(201).send({ status: true, message: 'User successfully created', data: newUser })
}

 catch (error) {
    console.log(error)
    return res.status(500).send({ message: error.message })
}

}


module.exports.createuser=createuser