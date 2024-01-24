const express = require("express")
const router = express.Router()
const {create,platform_validator , platform_edit_validator ,edit , remove } = require("../controllers/platform")

router.post("/add",platform_validator,create)
router.put("/edit/:plaform_id",platform_edit_validator, edit )
router.delete("/delete/:plaform_id" ,remove)
module.exports = router ;