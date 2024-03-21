const { sign } = require("jsonwebtoken");
const AdminModel = require("../models/admin")
const UserModel = require("../models/user");
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {body,validationResult} = require('express-validator')
const privateKey = require("../service/getPrivateKey");
const {assessment_validator, assessment_edit_validator , create, edit , remove , getAllAssessment} = require("../controllers/assessment");
const AdminLog = require("../models/AdminLog")
async function createAdmin(username,password){
    try {
        const existingUser = await UserModel.findOne({username});
        if(existingUser){
            throw new Error('User already exists');
        }
        const newUser =new  UserModel({
            username ,
            password : password,
            usertype : "admin"
        })
        newUser.save();
        const newAdmin = new AdminModel({
            user: newUser._id,
            status : true ,
            isSuperUser : false
        })
        await newAdmin.save();
        return true;
    }
    catch(error){
        if (error.code = 11000){
            console.log("User name already exist")
        }
        else {
            throw new Error("An error occurred while creating admin")
        }
    }
}


async function signUp(req, res){
    const {username ,password }=  req.body ;
    await createAdmin(username, password);
    return res.status(200).json({status : 200 , "message" : "created"}) 
}

const login_validator=[
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty()
]

async function login(req ,res){
    const errors = validationResult(req);
    try {
        if(!errors.isEmpty()){
            return res.status(400).json({status: "validation errors" ,"errors":errors})
        }
        const {username, password} = req.body ;
        const existingUser = await UserModel.findOne({"username":username});
        console.log(existingUser);
        if (!existingUser || !(await bycrpt.compare(password, existingUser.password))){
            return res.status(401).json({"status":"error" , "message":"username or password mismatch"})
        }
        else {
            console.log("____________");
            const existingAdmin =await  AdminModel.findOne({user:existingUser._id});
            if(!existingAdmin){
                return res.status(401).json({'status':"error" , "message" : "This user is not an admin"});
            }
            else {
                const token = jwt.sign({user:existingUser,isAdmin:true,isSuperUser: false},privateKey,  { algorithm: 'RS256', expiresIn: '48h' } )
                return res.status(200).json({ "status" : "success" ,token})
            }
        }
    }
    catch(err){
        return res.status(500).json({err})
    }
}

const verifyUser = (req , res) => {
    return res.status(200).json({message :  "your content is here "})
}


// assessment part



const getAllAssessmentByAdmin=(req ,res)=>{
    // getAllAssessment(req, res);
    // return res.status.json({"meesage" : "good"})
    return res.status(200).json({"status":true});
}


const addAssessmentByAdmin  = (req ,res)=>{
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()){
            return res.status(403).json({status : "error" , errors : errors.array()})
        }
        else {
            create(req , res)
        }
    }
    catch(error){
        return res.status(500).json({"message" :  "server err "+ error})
    }
}


const removeAssessmentByAdmin = (req, res)=>{
    remove(req,res);
}

const editAssessmentByAdmin = (req, res)=>{
    edit(req,res);
} 



// result  details 



const {getAllResult  , getSingleResult} = require("../controllers/test")


// platform 

const {create : platformCreate    , edit :  platformEdit , remove : platformRemove   , getAllPlatform , getAllPlatformDetails, platform_edit_validator , platform_validator } = require("../controllers/platform");

const createPlatformFromAdmin = (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(403).json({status : "error" , error : errors.array()})
    }
    platformCreate(req , res);
}

const editPlatformByAdmin=(req , res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({"status":"error",error : errors})
    }
    platformEdit(req ,res);
}

const removePlatformByAdmin=(req ,res)=>{
    platformRemove(req , res);
}

const getPlatformByAdmin=(req, res)=>{
    getAllPlatform(req , res);
}



const getAllPlatformDetailsByAdmin=(req , res)=>{
    getAllPlatformDetails(req, res);
}



//dashboard count 
const Assessment = require("../models/assessment");
const AssessmentDetails =require("../models/test");
const Candidate  = require("../models/candidate");
const Platforms = require("../models/platform");

async function homeCount(req, res){
    const totalAssessment = await Assessment.find().countDocuments();
    const totalCandidate = await Candidate.find().countDocuments();
    return res.status(200).json({totalAssessment : totalAssessment ,  totalCandidate});
 } 


async function assessmentCount(req, res){
    const totalAssessment= await Assessment.find().countDocuments();
    const totalAssessmentDetails = await AssessmentDetails.find().countDocuments();
    const totalPlatforms = await  Platforms.find({}).countDocuments();

    return res.status(200).json({totalAssessment, totalAssessmentDetails , totalPlatforms});
}


async function resultCount(req, res){
    const totalExam =  await AssessmentDetails.find().countDocuments();
    const pendingExam = await AssessmentDetails.find({status : 0 }).countDocuments();
    const publishedExam = await AssessmentDetails.find({status : 1}).countDocuments();
    return res.status(200).json({totalExam, pendingExam , publishedExam});
}

module.exports = {login , signUp, login_validator , verifyUser ,getAllAssessmentByAdmin , assessment_validator , addAssessmentByAdmin, removeAssessmentByAdmin, editAssessmentByAdmin, assessment_edit_validator , getAllResult , getSingleResult,createPlatformFromAdmin , editPlatformByAdmin , removePlatformByAdmin , getPlatformByAdmin , getAllPlatformDetailsByAdmin, homeCount , assessmentCount ,resultCount};