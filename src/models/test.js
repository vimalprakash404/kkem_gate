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
    "assessment":{ type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    "candidate": { type: Schema.Types.ObjectId, ref: 'Candidate', required: true } ,
    start_date_time: {
        type: Date,
        default: Date.now
      },
      end_date_time : 
      {
        type : Date 
      }
});

const Test = mongoose.model("Test" , testSchema);


module.exports = Test ;