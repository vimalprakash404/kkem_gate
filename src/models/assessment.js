const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const assessmentSchema = new Schema({
    test_id: { type: Number, required: true },
    test_name: { type: String, required: true },
    test_description: { type: String, required: true },
    platform: { type: Schema.Types.ObjectId, ref: 'Platform', required: true },
    created_at : {
        type : Date ,
        default : Date.now
    },
    updated_at :{
        type : Date ,
        require : false 
    } ,
    status :{
        type : Number ,
        default : 0
    }
});
/*
status 0 => active 
status 1 => removed 
*/

const Assessment = mongoose.model('Master-Assessment', assessmentSchema);

module.exports = Assessment;