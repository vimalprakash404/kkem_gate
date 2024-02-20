const mongoose = require("mongoose")
const Schema = {
    id : {
        type : Number ,
        required : true 
    },
    name :{
        type : String ,
        required : true 
    }
}

const District = mongoose.model("District",Schema);
module.exports =  District ;