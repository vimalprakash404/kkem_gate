const express = require("express")
const router = express.Router()
const {create,platform_validator , platform_edit_validator ,edit , remove } = require("../controllers/platform")
router.post("/add",platform_validator,create)
router.put("/edit/:platform_id",platform_edit_validator, edit )
router.delete("/delete/:platform_id" ,remove)
module.exports = router ;