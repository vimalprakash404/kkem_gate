const mongoose = require('mongoose')
const Schema = { 
    name :  {
        type : String ,
        required : true ,
        unique :  true
    },
    baseUrl : { 
        type :  String ,
        require :  true 
    },
    authKey : {
        type : String , 
        required  :  true 
    }
}

const Plaform = mongoose.model("Platform" , Schema)
module.exports = Plaform ;