const mongoose = require("mongoose")
const Schema = mongoose .Schema;
const testSchema =new Schema( {
    uniqueID : {
        type : Number ,
        required : false ,
        unique : true 
    },
    result :
    {
        type : Object,
        require : true 
    },
    "assessment":{ type: Schema.Types.ObjectId, ref: 'Master-Assessment', required: true },
    "candidate": { type: Schema.Types.ObjectId, ref: 'Candidate', required: true } ,
    start_date_time: {
        type: Date,
        default: Date.now
      },
      end_date_time : 
      {
        type : Date 
      },
      status : {
        type : Number ,
        default : 0 
      }
      /* 
      status 0  ->  assessement started 
      status 1 -> assesssement completed 
       */
});

const Test = mongoose.model("Assessment-Details" , testSchema);


module.exports = Test ;