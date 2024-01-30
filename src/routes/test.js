const express = require('express')
const router = express.Router();
const {isAuthenticatetedPlatform} = require("../middleware/authenticate")
router.use(express.json())
const  {create , updateResult ,test_result_update_validator , test_validator , getAllResult}= require("../controllers/test")
router.post("/create", test_validator,create);
router.post("/update/result",isAuthenticatetedPlatform,test_result_update_validator,updateResult);
router.get("/get/result", getAllResult)
module.exports = router ;