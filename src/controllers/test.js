
const {body , validationResult} = require("express-validator")
const {getPlatform} = require("../controllers/platform")
const {getAssessment} = require("../controllers/assessment")
const platformSchedule= require("../connection/platformSchedule")
const test = require("../models/test")


const test_validator= [
    body("assessment").isMongoId().notEmpty()
]
const test_result_update_validator = [
    body("uniqueID").notEmpty(),
    body("result").notEmpty().isObject()
]

const create = async (req , res)=> {
    const errors = validationResult(req) ;
    if(!errors.isEmpty()){
        return res.status(403).json({errors :  errors.array()})
    }
    else {
        const { assessment} = req.body;
        const assessment_object = await getAssessment(assessment);
        const platform = await getPlatform(assessment_object.platform);
        const data=await platformSchedule(platform.baseUrl,assessment_object.test_id , platform.authKey)
        if (data.status === 'error'){
            return res.status(data.code).json(data);
        }
        // createing tests 
        const uniqueID = data.data.uniqueID;
        const newtest = new test({uniqueID , assessment})
        const savedtest = await newtest.save();
        return res.status(200).json({ status: "success", data: savedtest , autoLoginURL : data.data.autoLoginURL})
    }
}





const updateResult = async(req ,  res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(403).json({status : "error", error : errors.array()})
    }
    const {uniqueID ,result} = req.body;
    const  existing_test =  await test.findOne({uniqueID});
    if (!existing_test){
        return res.status(404).json({status : "error",error : "Test with this not exist"})
    }
    existing_test.result =  result ;
    const updated_data =await existing_test.save();
    return res.status(200).json({status : "success" })

}

module.exports = {updateResult,create ,test_validator , test_result_update_validator} ;