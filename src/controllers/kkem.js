const {body , validationResult} = require("express-validator")
const data = require("../connection/getModules")

const form_validator = [
    body("email").isEmail(),
    body("mobile").isMobilePhone(),
    body("name").isString(),
    body("dwms_id").isString()

]
const test =async (req , res)  => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const smple = await data("id")
            return res.status(403).json({"errors" : errors.array() , smple : smple})
        
        }
        else {
            const { email , mobile , name  , dwms_id} = req.body;

        }
    }
    catch(err)
    {
        return res.status(500).json({err})

    }
    return res.status(200).json({"message" : "data is here to go"})
}

module.exports = {test ,form_validator};