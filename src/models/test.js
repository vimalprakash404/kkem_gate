const mongoose = require("mongoose")
const Schema = mongoose .Schema;
const testSchema =new Schema( {
    uniqueID : {
        type : Number ,
        required : true ,
        unique : true 
    },
    result :
    {
        type : Object,
        require : true 
    },
    "assessment": { type: Schema.Types.ObjectId, ref: 'Assessment', required: true }
});

const Test = mongoose.model("Test" , testSchema);


module.exports = Test ;