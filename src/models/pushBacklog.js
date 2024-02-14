const mongoose = require('mongoose');
const Schema = {
    requestBody : {
        type : Object ,
        required : true 
    },
    response :{
        type : Object ,
        required : true 
    },
    DateAndTime : {
        type : Date,
        default : new Date()
    }
}

const PushBackLog = mongoose.model("pushBackLog",Schema);
module.exports = PushBackLog ;