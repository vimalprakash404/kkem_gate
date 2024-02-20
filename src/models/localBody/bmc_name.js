const mongoose = require('mongoose');
const Schema = {
    id : {
        type : Number
    },
    name : {
        type : String 
    }
}
const bmcName = new mongoose.model("BmcName", Schema); 
module.exports = bmcName;