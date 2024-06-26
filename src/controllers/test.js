
const { body, validationResult } = require("express-validator")
const { getPlatform } = require("../controllers/platform")
const { getAssessment } = require("../controllers/assessment")
const platformSchedule = require("../connection/platformSchedule")
const test = require("../models/test")
const candidateModel = require("../models/candidate")
const { getSingleCandidate } = require("../controllers/candidate")
const {isMongoId} = require('mongoose')
const resultPushBack = require("../connection/resultPushBack")
const pushBackLog = require("../models/pushBacklog")

const test_validator = [
    body("assessment").isMongoId().notEmpty(),
    body("candidate").isMongoId().notEmpty()
]
const test_result_update_validator = [
    body("assessment_id").isMongoId().notEmpty(),
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

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}

const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ errors: errors.array() })
        }
        else {
            const { assessment, candidate } = req.body;
            const newtest = new test({ assessment, candidate })
            const assessment_object = await getAssessment(assessment);
            if (assessment_object === null) {
                return res.status(404).json({ status: "error", message: "assessement not found" })
            }
            const candidate_object = await getSingleCandidate(candidate);
            if (candidate_object == null) {
                return res.status(404).json({ status: "error", message: "candidate not found" })
            }
            const platform = await getPlatform(assessment_object.platform);
            // console.log(assessment_object.platform)
            const data = await platformSchedule(platform.baseUrl, assessment_object.test_id, platform.authKey, candidate_object.email, candidate_object.firstName, candidate_object.lastName, getdateTimeNow(), newtest._id)
            if (data.status === 'error') {
                return res.status(data.code).json(data);
            }
            // createing tests 
            const uniqueID = data.data.uniqueID;

            newtest.uniqueID = uniqueID;
            console.log("test" + newtest._id)
            const savedtest = await newtest.save();
            return res.status(200).json({ status: "success", data: savedtest, autoLoginURL: data.data.autoLoginURL })
        }
    }
    catch (err) {
        return res.status(500).json({ status: "error", message: "server err" + err })
    }

}

const getAllResult = (req, res) => {
    try {
        test.find({})
            .populate('candidate')
            .populate('assessment')
            .then((tests) => {
                const newData = tests.map(test =>({
                    "id" : test._id , 
                    "Candidate Name" :  `${test.candidate.firstName} ${test.candidate.lastName}`,
                    "Candidate Email" : test.candidate.email,
                    "Candidate mobile" : test.candidate.mobile,
                    "Dwms Id" : test.candidate.dwmsID,
                    "Unique ID": test.uniqueID , 
                    "Assessment" : test.assessment.test_name,
                    "Status" :  (test.status===0?"pending":"result") 
                }))
                return res.status(200).json({ status: "success", data: newData })
            })
            .catch((err) => {
                console.error(err);
                return res.status(401).json({ status: "error", error: err })
            });
    }
    catch (error) {
        return res.status(500).json({ status: "error", message: "server" + err })
    }
}

const getSingleResult =async (req , res)=>{
    try {
        const {id} = req.body;
        console.log("id :"+id)
        const  data = await test.findOne({_id : id})
        const result = data.result["scores"];
        return res.status(200).json({status : "success" , data : result})
    }
    catch(err) {
        return res.status(500).json({ status: "error", message: "server" + err })
    }
}




const updateResult = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ status: "error", error: errors.array() })
    }
    const { assessment_id, result } = req.body;
    const _id = assessment_id;
    const existing_test = await test.findOne({ _id });
    if (!existing_test) {
        return res.status(404).json({ status: "error", error: "Test with this not exist" })
    }
    existing_test.result = result;
    existing_test.status = 2;
    existing_test.end_date_time = Date.now();
    const updated_data = await existing_test.save();
    return res.status(200).json({ status: "success" })

}




const new_update_validator = [
    body("result").isObject().notEmpty(),
    body("result.candidateId").isString()
]
function isValidObjectId(str) {
    // Check if the string is 24 characters long
    if (typeof str === 'string' && str.length === 24) {
        // Check if the string consists only of hexadecimal characters
        return /^[0-9a-fA-F]{24}$/.test(str);
    }
    return false;
}

async function pushBackToKkem(assessment_id,result){
    const assessmentDetails= await test.findOne({ _id : assessment_id});
    const candidateObject = await candidateModel.findOne({_id : assessmentDetails.candidate});
    console.log("Assessment Details",assessmentDetails);
    console.log("Candidate Details",candidateObject);
    const requestData = {"dwmsID" :  candidateObject.dwmsID , result }
    const responseData = await resultPushBack("https://httpbin.org/post",{"key":"vimal"}, requestData);
    
    const pushLog=new pushBackLog({
        requestBody : requestData,
        response : responseData,
        DateAndTime : Date.now()
    });
    await pushLog.save();
}

const newUpdateResult = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ status: "error", error: errors.array() })
        }
        const assessment_id = req.body.result.candidateId;
        const result = req.body.result;
        const _id = assessment_id;
        if(!isValidObjectId(_id)){
            return res.status(404).json({ status: "error", error: "Test with this id not valid" })
        }
        const existing_test = await test.findOne({ _id });
        if (!existing_test) {
            return res.status(404).json({ status: "error", error: "Test with this id not exist" })
        }
        existing_test.result = result;
        existing_test.status = 2;
        existing_test.end_date_time = Date.now();
        const updated_data = await existing_test.save();
        await pushBackToKkem(assessment_id , result);
        return res.status(200).json({
            "status": "success",
            "responseCode": 200,
            "message": "Data Saved"
            })
    }
    catch (error) {
        return res.status(500).json({"status":"error",error:error})
    }

}



module.exports = { updateResult, create, test_validator, test_result_update_validator, getAllResult,getSingleResult, newUpdateResult, new_update_validator };