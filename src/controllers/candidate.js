const jwt = require("jsonwebtoken")
const privateKey = require("../service/getPrivateKey");
const {body , validationResult}  = require("express-validator")
const Candidate = require("../models/candidate")
const validate_data = [
  body("firstName").isString().notEmpty() ,
  body("lastName").isString().notEmpty() ,
  body("dwmsID").isString().notEmpty(),
  body("email").isEmail().notEmpty(),
  body("mobile").isMobilePhone()
]
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
    console.log(req)
    if(!existing_candidate){
      const newCandidate = new Candidate(req.body);
      newCandidate.save();
      const user = newCandidate ;
      const token = jwt.sign({ user }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
      newCandidate._id = undefined ;

      return res.status(200).json({newuser : 1 , data : newCandidate , "status" : "success" , autologin : `http://${req.headers.host}?token=${token}`})
    }
    else{
      const user = existing_candidate ;
      const token = jwt.sign({ user }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
      return res.status(200).json({newuser : 0 , data : existing_candidate , "status" : "success" ,autologin : `http//${req.headers.host}?token=${token}`})
    }
  }
  catch(err){
    return res.status(500).json({err})
  }
 
}

const get_candidate =(req ,res)=>{
  return res.status(200).json({data:req.user.user})
}
const getSingleCandidate =async(objectId) => {
  return await Candidate.findOne({"_id":objectId})
}

module.exports = {login ,candidate, validate_data,get_candidate,getSingleCandidate}