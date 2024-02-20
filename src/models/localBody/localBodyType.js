const mongoose = require('mongoose')
const Schema = {
    lb_type_id : { 
        type :  Number 
    },
    lb_type_name : { 
        type : String 
    },
    lb_type_name: {
        type: String,
        required: true,
        unique: true
    },
    lb_type_abbr : {
        type : String ,
        enum :  ["M","MC","G","Others"] ,
        required : true 
    },
    active : {
        type : String ,
        enum : ["Y", "N"]
    }

}

const localBodyType  = mongoose.model("LocalBodyType", Schema);
module.exports = localBodyType;
