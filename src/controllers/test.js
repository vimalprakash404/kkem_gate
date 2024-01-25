
const { body, validationResult } = require("express-validator")
const { getPlatform } = require("../controllers/platform")
const { getAssessment } = require("../controllers/assessment")
const platformSchedule = require("../connection/platformSchedule")
const test = require("../models/test")
const {getSingleCandidate} = require("../controllers/candidate")

const test_validator = [
    body("assessment").isMongoId().notEmpty(),
    body("candidate").isMongoId().notEmpty()
]
const test_result_update_validator = [
    body("uniqueID").notEmpty(),
    body("result").notEmpty().isObject()
]
function getdateTimeNow() {
    const currentDate = new Date();
    
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  
    const formattedDate = `${year}-${day}-${month} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }

const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ errors: errors.array() })
        }
        else {
            const { assessment , candidate} = req.body;

            const assessment_object = await getAssessment(assessment);
            if (assessment_object === null ){
                return res.status(404).json({status : "error" , message : "assessement not found"})
            }
            const candidate_object = await getSingleCandidate(candidate);
            if (candidate_object == null){
                return res.status(404).json({status : "error" , message : "candidate not found"})
            }
            const platform = await getPlatform(assessment_object.platform);
            console.log(assessment_object.platform)
            const data = await platformSchedule(platform.baseUrl, assessment_object.test_id, platform.authKey , candidate_object.email ,candidate_object.firstName , candidate_object.lastName ,getdateTimeNow())
            if (data.status === 'error') {
                return res.status(data.code).json(data);
            }
            // createing tests 
            const uniqueID = data.data.uniqueID;
            const newtest = new test({ uniqueID, assessment ,candidate})
            const savedtest = await newtest.save();
            return res.status(200).json({ status: "success", data: savedtest, autoLoginURL: data.data.autoLoginURL })
        }
    }
    catch(err)
    {
        return res.status(500).json({status: "error" , message : "server err"+err})
    }
    
}





const updateResult = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ status: "error", error: errors.array() })
    }
    const { uniqueID, result } = req.body;
    const existing_test = await test.findOne({ uniqueID });
    if (!existing_test) {
        return res.status(404).json({ status: "error", error: "Test with this not exist" })
    }
    existing_test.result = result;
    const updated_data = await existing_test.save();
    return res.status(200).json({ status: "success" })

}

module.exports = { updateResult, create, test_validator, test_result_update_validator };