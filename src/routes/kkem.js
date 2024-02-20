const express = require("express")
const {isAuthenticatetedKKEM} = require("../middleware/authenticate")

const router= express.Router()
const {get_dist_lists , get_bmc_list , getDistrictFromDb, get_lb_type,getLbTypeFromDb , get_lb,insertCandidate , candidateValidator} = require("../controllers/kkem")
router.get("/district",getDistrictFromDb);
router.get("/get_bmc_name",isAuthenticatetedKKEM,get_bmc_list);
router.get("/get_lb_type",getLbTypeFromDb);
router.get("/get_lb",isAuthenticatetedKKEM,get_lb);
router.post("/start",isAuthenticatetedKKEM,candidateValidator,insertCandidate);
module.exports = router ;