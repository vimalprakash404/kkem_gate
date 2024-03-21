const express = require("express")
const router = express.Router();

const {create,edit,remove , assessment_edit_validator , assessment_validator , getAllAssessment} = require("../controllers/assessment")
router.post("/add", assessment_validator,create );
router.put("/edit/:assessment_id",assessment_edit_validator, edit);
router.delete("/remove/:assessment_id", remove);
router.post("/",getAllAssessment);

module.exports = router ;