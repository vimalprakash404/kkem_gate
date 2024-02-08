const jwt = require("jsonwebtoken")
const privateKey = require("../service/getPrivateKey");
const {body , validationResult}  = require("express-validator")
const Candidate = require("../models/candidate")

// district list
const   district = [
            "Alappuzha",
            "Ernakulam",
            "Idukki",
            "Kannur",
            "Kasaragod",
            "Kollam",
            "Kottayam",
            "Kozhikode",
            "Malappuram",
            "Palakkad",
            "Pathanamthitta",
            "Thiruvananthapuram",
            "Thrissur",
            "Wayanad"
]  

// district validator
const validate_data = [
  body("firstName").isString().notEmpty() ,
  body("lastName").isString().notEmpty() ,
  body("dwmsID").isString().notEmpty(),
  body("email").isEmail().notEmpty(),
  body("mobile").isMobilePhone(),
  body("district").notEmpty().withMessage("district field is required").isIn(district).withMessage('Invalid distrcit accept only '+district)
]


//
const login =(req, res)=>{
    const {username ,password} = req.body ;
    if (username === 'demo' && password === 'password') {
        const token = jwt.sign({ username }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
}

const candidate =async(req ,res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(403).json({errors :errors.array(),"status" : "error"})
    }
    const {firstName, lastName , dwmsID , email , mobile} = req.body;
    const existing_candidate =await Candidate.findOne({$or: [
      { dwmsID: dwmsID },
      { email: email },
      {mobile :mobile}
    ]})
    if(!existing_candidate){
      const newCandidate = new Candidate(req.body);
      newCandidate.save();
      const user = newCandidate ;
      const token = jwt.sign({ user }, privateKey, { algorithm: 'RS256', expiresIn: '72h' });
      newCandidate._id = undefined ;

      return res.status(200).json({newuser : 1 , data : newCandidate , "status" : "success" , autologin : `http://${req.headers.host}?token=${token}`})
    }
    else{
      const user = existing_candidate ;
      const token = jwt.sign({ user }, privateKey, { algorithm: 'RS256', expiresIn: '48h' });
      return res.status(200).json({newuser : 0 , data : existing_candidate , "status" : "success" ,autologin : `http://${req.headers.host}?token=${token}`})
    }
  }
  catch(err){
    return res.status(500).json({err})
  }
 
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


//get all candidate list 
const get_candidate =(req ,res)=>{
  const resData =req.user.user
  
  const data=searchElement({lb_id:Number(resData.lb_id)})
  console.log(data);  
  const district = searchDistrict({id:data.dist_id})
  resData.district = district.name;
  resData.lb_name = data.lb_name;
  return res.status(200).json({data:resData})
}

// get single candidate
const getSingleCandidate =async(objectId) => {
  return await Candidate.findOne({"_id":objectId})
}

module.exports = {login ,candidate, validate_data,get_candidate,getSingleCandidate}