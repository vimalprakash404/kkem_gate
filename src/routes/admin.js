const express = require("express")
const router = express.Router();
const {isAuthenticatedAdmin} = require("../middleware/authenticate")
const {signUp , login , login_validator, verifyUser ,editAssessmentByAdmin , assessment_edit_validator, getAllAssessmentByAdmin, addAssessmentByAdmin, assessment_validator, removeAssessmentByAdmin , getAllResult , getSingleResult, getAllPlatformDetailsByAdmin } = require("../controllers/admin");
// create 
router.post("/login", login_validator,login);
router.post("/signup", signUp);
router.post("/verify",isAuthenticatedAdmin,getAllAssessmentByAdmin);
router.post("/assessment/add",assessment_validator, addAssessmentByAdmin);
router.post("/assessment/remove/:assessment_id", removeAssessmentByAdmin);
router.post("/assessment/edit/:assessment_id", assessment_edit_validator,editAssessmentByAdmin);

// Test admin routing 
router.get("/test/get",getAllResult);
router.post("/test/get/single/", getSingleResult);

const {platform_edit_validator , platform_validator  , createPlatformFromAdmin , editPlatformByAdmin , removePlatformByAdmin , getPlatformByAdmin } = require("../controllers/admin")
// Platform
router.post("/platform/add/",createPlatformFromAdmin );
router.post("/platform/edit/:platform_id",editPlatformByAdmin);
router.post("/platform/remove/:platform_id" , removePlatformByAdmin);
router.get("/platform/get", getPlatformByAdmin);
router.get("/platform/get/details", getAllPlatformDetailsByAdmin)

//count 
const {homeCount , assessmentCount, resultCount}  = require("../controllers/admin")

router.post("/count/home/", homeCount);
router.post("/count/assessment/" , assessmentCount);
router.post("/count/result/" ,  resultCount);

module.exports = router;