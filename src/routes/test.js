const express = require('express')
const router = express.Router();
const {isAuthenticatetedPlatform} = require("../middleware/authenticate")
const {reqBody} = require("../middleware/debug/reqBody")


router.use(express.json())
const  {create , updateResult ,test_result_update_validator , test_validator , getAllResult ,newUpdateResult,new_update_validator}= require("../controllers/test")
router.post("/test/create", test_validator,create);
router.post("/result/update",reqBody,isAuthenticatetedPlatform,new_update_validator,newUpdateResult);
router.get("/test/get/result", getAllResult)
module.exports = router ;