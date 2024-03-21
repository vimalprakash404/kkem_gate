const mongoose = require('mongoose')
const  bycrpt = require('bcrypt')
const Schema = mongoose.Schema;

const adminSchema = {
    user : {
        type : Schema.Types.ObjectId ,
        ref : "User"
    },
    status : {
        type : Boolean,
        default : true 
    },
    isSuperUser : {
        type : Boolean ,
        default : false 
    }
}
const admin = mongoose.model("Admin",adminSchema);

module.exports = admin ;