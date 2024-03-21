const fs = require("fs")
const jwt = require("jsonwebtoken")
const secretKey = require("../service/getPrivateKey")
const KKEM = "KKEM" ;
const platform_key = "platform" ;

function authenticateCandidate(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
  
      req.user = user;
      next();
    });
  }


function isAuthenticatetedKKEM(req, res, next ) {
    isAuthenticateted(req, res, next, KKEM);
}

function isAuthenticatetedPlatform(req, res, next){
    isAuthenticateted(req, res , next , platform_key)
}

function isAuthenticateted(req, res, next , key)
{
    const {authorizationkey} = req.headers;
    if (typeof authorizationkey !== "undefined") {
        let token = authorizationkey;
        
        try{
            jwt.verify(token, key, (err, user) => {
                if (err instanceof jwt.JsonWebTokenError) {
                    return res.status(401).json({status : "error", error: "invalid token" })
                }
                return next();
            });
        }
        catch(err){
            if ((err  )){
                console.log()
                return res.status(401).json({"message" : err})
            }
        }
        
    }
    else {
        res.status(401).json({ status : "error","error": "Authorization Failed , No Authorization key Provided" })
        throw new Error("Not Authorized")
    }
}


function isAuthenticatedAdmin(req, res, next ){
    const {authorization} = req.headers ;
    console.log("headers:"+JSON.stringify(req.headers));
    if (typeof authorization !== "undefined"){
        let token = authorization;
        
        try {
            jwt.verify(token,secretKey ,(err, user)=>{
                if (err instanceof jwt.JsonWebTokenError) {
                    return res.status(401).json({status : "error", error: "invalid token" })
                    
                }
                req.user = user ; 
                return next();
            } )
        }
        catch(error){
            return res.status(500).json({message :error})
        }
    }else{
        return res.status(401).json({status : "error", error: "invalid token" })
    }
}
module.exports ={ isAuthenticatetedPlatform, isAuthenticatetedKKEM ,authenticateCandidate , isAuthenticatedAdmin};