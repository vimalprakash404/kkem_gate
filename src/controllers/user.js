const { body, validationResult } = require("express-validator");


const user_type = ["admin", "kkem"]
const userModel = require("../models/user")
const users_validator = [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
    body("usertype").notEmpty().isIn(user_type).withMessage("usertype only accepts the " + user_type).custom()
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
    body()
]

async function insertUser(username, password, usertype) {
    try {
        const newUser = new userModel({ username, password, usertype });
        await newUser.save();
    }
    catch (err) {
        new Throw(err)
    }
}


const signup = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "validation error", "errors": errors.array() })
        }
        insertUser(req.body);
        return res.status(200).json({status :  "success" , "message" : "user created successfully " })
    }
    catch (err) {
        return res.status(400).json({status : "error" , "errors" : err})
    }


}

const login = (req, res) =>{
    
}

module.exports = {}