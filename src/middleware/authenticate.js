const fs = require("fs")
const jwt = require("jsonwebtoken")
const KKEM = "KKEM" ;
const platform_key = "platform" ;


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
module.exports ={ isAuthenticatetedPlatform, isAuthenticatetedKKEM};