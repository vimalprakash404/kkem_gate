const { body, validationResult } = require("express-validator");
const bycrpt = require("bcrypt")
const jwt = require("jsonwebtoken")
const user_type = ["admin", "kkem"]
const userModel = require("../models/user")
const users_validator = [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
    body("usertype").notEmpty().isIn(user_type).withMessage("usertype only accepts the " + user_type)
]
const checkTheUserExisting = async (value) => {
    const existingUser = await userModel.findOne({ username: value });
    if (existingUser) {
        return true
    }
    return false
}

const loginValidator = [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty()
]

async function insertUser(username, password, usertype) {
    try {
        
    }
    catch (err) {
        new Throw(err)
    }
}


const signup =async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "validation error", "errors": errors.array() })
        }
        const newUser = new userModel(req.body );
        await newUser.save();
        return res.status(200).json({status :  "success" , "message" : "user created successfully " })
    }
    catch (err) {
        return res.status(400).json({status : "error" , "errors" : err})
    }


}

const login_kkem = async(req, res) =>{
    const errors = validationResult(req);
    try{
        if (!errors.isEmpty())
            return res.status(400).json({status :  "validation error" , "errors" :  errors.array()})
        const {username,password} = req.body ;
        const hashPassword = await bycrpt.hash(password , 10)
        const user = await userModel.findOne({"username":username})
        console.log(hashPassword)
        if (!user || !(await bycrpt.compare(password, user.password))){
            return res.status(401).json({"status":"error" , "message":"username or password mismatch"})
        }
        else {
            const token = jwt.sign({ "body": "stuff" }, "KKEM", {expiresIn: '1h'})
            return res.status(200).json({"status" : "success" , username , token})
        }

    }
    catch(error){
        res.status(500).json({status : "error"  , "error" :"server error"+error})
    }
    

}

module.exports = {login_kkem,signup, loginValidator , users_validator}