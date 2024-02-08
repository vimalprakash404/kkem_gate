const express = require("express")
const {isAuthenticatetedKKEM} = require("../middleware/authenticate")

const router= express.Router()
const {get_dist_lists , get_bmc_list , get_lb_type , get_lb,insertCandidate , candidateValidator} = require("../controllers/kkem")
router.get("/district",isAuthenticatetedKKEM,get_dist_lists);
router.get("/get_bmc_name",isAuthenticatetedKKEM,get_bmc_list);
router.get("/get_lb_type",isAuthenticatetedKKEM,get_lb_type);
router.get("/get_lb",isAuthenticatetedKKEM,get_lb);
router.post("/start",candidateValidator,insertCandidate);
module.exports = router ;