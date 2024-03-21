const mongoose = require("mongoose")



const AdminSchema  = {
    action : String ,
    DateAndTime : Date,
    value :{
        type : String ,
        required : false 
    }
}

const AdminLog = mongoose.model("AdminLog", AdminSchema);

module.exports = AdminLog; 