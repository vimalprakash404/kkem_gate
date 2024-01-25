const express = require("express")
const router = express.Router();
const {authenticateCandidate , isAuthenticatetedKKEM}=require("../middleware/authenticate")
const {login , candidate , validate_data ,get_candidate} = require("../controllers/candidate")
router.post("/login",login);
router.post("/",isAuthenticatetedKKEM,validate_data,candidate);
router.get("/",authenticateCandidate,get_candidate)
module.exports = router ;