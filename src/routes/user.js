const express = require("express")
const router = express.Router()
const {login_kkem, signup , loginValidator , users_validator} = require("../controllers/user")
router.post("/signup",users_validator,signup)
router.post("/login",loginValidator,login_kkem)
module.exports = router ;
