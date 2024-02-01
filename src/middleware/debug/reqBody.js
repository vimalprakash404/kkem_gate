function reqBody(req,res,next){

    console.log("_________________________")
    console.log("request body" , req.body)
    console.log("__________________________")
    next();
}

module.exports = {reqBody}
