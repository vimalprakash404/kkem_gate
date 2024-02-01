// controller

const { body, validationResult } = require('express-validator');
const platform = require("../models/platform");


const isPlatformNameUnique = async (name) => { 
    const existingPlatform = await platform.findOne({ name });
    return !existingPlatform;
}

const platform_validator = [
    body("name").isString().notEmpty().custom(
        async (name) => {
            if (!(await isPlatformNameUnique(name))) {
                return Promise.reject("Platform with this name already exists");
            }
        }
    ),
    body("baseUrl").isURL().notEmpty(),
    body("authKey").notEmpty(),
]

const create = async (req, res) => {
    try {
        console.log(req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ errors: errors.array() })
        } else {
            const { name, baseUrl, authKey } = req.body;
            const newPlatform = new platform({
                name, baseUrl, authKey
            })
            const savePlatform = await newPlatform.save();
            return res.status(200).json({ status: "success", data: savePlatform })
        }
    } catch (err) {
        res.status(500).json({ "error": err.message, "message": "Internal Server error" })
    }
}

const platform_edit_validator = [
    body("name").isString().notEmpty(),
    body("baseUrl").isURL().notEmpty(),
    body("authKey").notEmpty(),
];


const edit =  async (req, res) =>  { 
    try {
        const errors=  validationResult(req);
        if (!errors.isEmpty()){
            return res.status(403).json({errors :  errors.message()})
        }
        const  platform_id = req.params.platform_id;
        const {name, baseUrl , authKey} = req.body;
        const existingPlatform = await platform.findById(platform_id);

        if(!existingPlatform) {
            return res.status(404).json({error :  "Platform not found"})
        }

        if (existingPlatform.name !== name){
            if (isPlatformNameUnique(name) === false)
            {
                return res.status(400).json({error : "Platform with this name already exists"})
            }
        }
        existingPlatform.name = name;
        existingPlatform.authKey = authKey;
        existingPlatform.baseUrl = baseUrl ;

        const updatedPlatform =await existingPlatform.save();
        return res.status(200).json({status : "success" , data :  updatedPlatform})
    }
    catch(err) {
        return res.status(500).json({error:"Internal server error", err :err.message})
    }
}


const remove = async (req, res) => {
    try {
        
        const platformId = req.params.platform_id;

        // Check if the platform with the given ID exists
        const existingPlatform = await platform.findById(platformId);

        if (!existingPlatform) {
            return res.status(404).json({ error: "Platform not found" });
        }

        // Remove the platform
        await existingPlatform.deleteOne();

        return res.status(200).json({ status: "success", message: "Platform deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message, message: "Internal Server error" });
    }
}


const getPlatform= async (platform_id) => {
    const existingPlatform = await platform.findOne({"_id": platform_id});
    return existingPlatform ;
}

module.exports = { create, platform_validator , platform_edit_validator , edit , remove , getPlatform};
