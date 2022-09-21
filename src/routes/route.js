const express = require('express')
const router = express.Router()
const usercontroller = require ("../controller/usercontroller")


router.post ("/register",usercontroller.createuser)



module.exports = router