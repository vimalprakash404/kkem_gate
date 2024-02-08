const { body, validationResult } = require("express-validator")
const data = require("../connection/getModules")
const { search } = require("../routes/kkem")
const Candidate = require("../models/candidate")
const jwt = require('jsonwebtoken')
const privateKey = require("../service/getPrivateKey");

const form_validator = [
    body("email").isEmail(),
    body("mobile").isMobilePhone(),
    body("name").isString(),
    body("dwms_id").isString()

]
const test = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const smple = await data("id")
            return res.status(403).json({ "errors": errors.array(), smple: smple })

        }
        else {
            const { email, mobile, name, dwms_id } = req.body;

        }
    }
    catch (err) {
        return res.status(500).json({ err })

    }
    return res.status(200).json({ "message": "data is here to go" })
}

const get_dist_lists = (req, res) => {
    const data = require("./data/dist_name.json");
    return res.status(200).json({ data });
}
const get_bmc_list = (req, res) => {
    const data = require("./data/bmc_name.json");
    return res.status(200).json({ data });
}

const get_lb_type = (req, res) => {
    const data = require("./data/lb_type.json")
    return res.status(200).json({ data })
}



const get_lb = (req, res) => {
    const data = require("./data/data.json");
    return res.status(200).json({ data })

}

function searchElement(options) {
    const jsonData = require("./data/data.json");
    return jsonData.find(item => {
        for (let key in options) {
            if (item[key] !== options[key]) {
                return false;
            }
        }
        return true;
    });
}
function searchDistrict(options) {
    const jsonData = require("./data/dist_name.json");
    return jsonData.find(item => {
        for (let key in options) {
            if (item[key] !== options[key]) {
                return false;
            }
        }
        return true;
    });
}

function searchBMC(options) {
    const jsonData = require("./data/bmc_name.json");
    return jsonData.find(item => {
        for (let key in options) {
            if (item[key] !== options[key]) {
                return false;
            }
        }
        return true;
    });
}
function searchLB(options) {
    const jsonData = require("./data/lb_data.json");
    return jsonData.find(item => {
        for (let key in options) {
            if (item[key] !== options[key]) {
                return false;
            }
        }
        return true;
    });
}



candidateValidator = [
    body("firstName").isString().notEmpty(),
    body("lastName").isString().notEmpty(),
    body("dwmsID").isString().notEmpty(),
    body("email").isEmail().notEmpty(),
    body("mobile").isMobilePhone(),
    body("dist_id").isNumeric().notEmpty(),
    body("lb_type_id").isNumeric().notEmpty(),
    body("lb_code").isString().notEmpty()
]

const insertCandidate = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ errors: errors.array(), "status": "error" })
        }
        const { dist_id, lb_type_id, lb_code, firstName, lastName, dwmsID, email, mobile } = req.body;
        const dataExist = searchElement({ dist_id, lb_type_id, lb_code })
        if (dataExist !== undefined) {
           
            const existing_candidate = await Candidate.findOne({
                $or: [
                    { dwmsID: dwmsID },
                    { email: email },
                    { mobile: mobile }
                ]
            })
            const district_ob = searchDistrict({ id: dist_id });
            if (!existing_candidate) {
                const newCandidate = new Candidate(req.body);
                newCandidate.lb_id=dataExist.lb_id;
                newCandidate.save();
                const user = newCandidate;
                const resData = newCandidate.toObject() ;
                delete resData["_id"]; 
                resData["district"] = district_ob.name;
                resData["lb_code"] = dataExist.lb_code;
                resData["lb_name"] = dataExist.lb_name;
                const token = jwt.sign({ user }, privateKey, { algorithm: 'RS256', expiresIn: '72h' });
                newCandidate._id = undefined;
                return res.status(200).json({ newuser: 1, data: resData, "status": "success", autologin: `http://${req.headers.host}?token=${token}` })
            }
            else {
                const user = existing_candidate;
                const token = jwt.sign({ user }, privateKey, { algorithm: 'RS256', expiresIn: '48h' });
                existing_candidate["district"] = district_ob.name;
                existing_candidate["lb_code"] = dataExist.lb_code;
                existing_candidate["lb_name"] = dataExist.lb_name;
                const resData = user.toObject() ;
                delete resData["_id"]; 
                console.log("After deletion:");
                console.log("user:", user);
                resData["district"] = district_ob.name;
                resData["lb_code"] = dataExist.lb_code;
                resData["lb_name"] = dataExist.lb_name;
                return res.status(200).json({ newuser: 0, data: resData, "status": "success", autologin: `http://${req.headers.host}?token=${token}` })
            }
        }
        else {
            return res.status(401).json({ status: "error", error: "local body not found" })
        }
    }
    catch (err) {
        return res.status(500).json({ err })
    }

}

module.exports = { test, form_validator, get_bmc_list, get_dist_lists, get_lb_type, get_lb, insertCandidate, candidateValidator };