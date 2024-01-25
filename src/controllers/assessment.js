const { body, validationResult } = require('express-validator');
const Assessment = require("../models/assessment")

const {getPlatform} = require("../controllers/platform")

const isAssessmentNameUnqiue =  async (test_name) => {
    const existingAssessment =  await Assessment.findOne({test_name})
    return !existingAssessment;
}

assessment_validator =  [
    body("test_id").isNumeric().notEmpty(),
    body("test_name").isString().notEmpty().custom(
        async (name) => {
            if (!(await isAssessmentNameUnqiue(name))) {
                return Promise.reject("Assessment with this name already exists");
            }
        }
    ),
    body("test_description").isString().notEmpty(),
    body("platform").isMongoId().notEmpty()
]




const create = async(req, res) => { 
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(403).json({errors : errors.array()})
        }
        const {test_id , test_name , test_description , platform} = req.body;
        const platform_object = await getPlatform(platform);
        if (platform_object === null)
        {
            return res.status(404).json({status : "error"  ,message : "plaform not found"})
        }
        
        const newAssessment = new Assessment({
            test_id , test_name , test_description, platform
        })
        const savedAssessment = await newAssessment.save();
        return res.status(200).json({status : "success" , "data" : savedAssessment})
    }
    catch (err){
        return res.status(400).json({error:`server err ${err.message}`})
    }
}

assessment_edit_validator =  [
    body("test_id").isNumeric().notEmpty(),
    body("test_name").isString().notEmpty(),
    body("test_description").isString().notEmpty(),
    body("platform").isMongoId().notEmpty()
]

const edit = async (req, res) => { 
    try {
        if(!errors.isEmpty()){
            return res.status(403).json({errors: errors.message()})
        }
        const assessment_id = req.params.assessment_id;
        const {test_id , test_name , test_description , platform} = req.body;
        const existingAssessment = await Assessment.findById(assessment_id);
        if (!existingAssessment){
            return res.status(404).json({"message" :  "Assessment not found"})
        }
        if (existingAssessment.test_name !== test_name ){
            if(isAssessmentNameUnqiue(test_name) === false ){
                return res.status(400).json({"message" : "Assesssemnt with this name already exists"})
            }
        }
        existingAssessment.test_name = test_name;
        existingAssessment.test_id = test_id;
        existingAssessment.test_description = test_description;
        existingAssessment.platform = platform ;
        const saved_object = await existingAssessment.save();
        return res.status(200).json({status : "success" , data : saved_object})

    }
    catch (err){
        return res.status(500).json({"error" : `Internal Server Error ${err.message}`})
    }
}


const remove = async (req , res) => {
    try { 
        const assessment_id = req.params.assessment_id;
        const  existingAssessment = await Assessment.findById(assessment_id);
        if (!existingAssessment) { 
            return res.status(404).json({error : "Assesment not Found"})
        }
        await existingAssessment.deleteOne();

        return res.status(200).json({"status" :"success" , "message" : "Assesment deleted successfully"})
    }catch (err){
        res.status(500).json({"eroor" : `Internal Server error ${err.message}`})
    }
}

const getAllAssessement =  async(req , res) => { 
    const data = await Assessment.find({});
    console.log(data)
    return res.status(200).json(data)
}

const getAssessment =async(objectId) => {
    return await Assessment.findOne({"_id":objectId})
}

module.exports = {assessment_validator , assessment_edit_validator, create  ,edit , remove ,getAssessment ,getAllAssessement}