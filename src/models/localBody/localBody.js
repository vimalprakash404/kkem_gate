const mongoose = require('mongoose')
const localBodyType = require('./localBodyType')
const Schema = {
    lb_id : { 
        type : Number ,
        required : true 
    },
    dist_id : {
        type : Number 
    },
    lb_type_id :{
        type : Number 
    },
    lb_name : {
        type : String 
    },
    lb_code : {
        type : String 
    }
}

const localBody=  mongoose.model("LocalBody",Schema)
module.exports = localBody;