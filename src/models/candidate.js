const mongoose =require("mongoose")
const Schema = mongoose.Schema;
const candidateSchema = new Schema({
    firstName : {
        type : String ,
        require : true 
    },
    lastName : {
        type : String ,
        require : true
    },
    dwmsID :{
        unique : true ,
        type : String ,
        require : true 
    },
    email :{
        unique : true ,
        type : String ,
        require : true 
    } ,
    mobile : {
        unique : true ,
        type : Number ,
        require : true 
    },
    district :{
        type : String 
    },
    created_date_time :{
        require : true ,
        type : Date ,
        default : Date.now 
    },
    lb_id : {
        type : String 
    }
});

const Candidate= mongoose.model('Candidate' , candidateSchema);

module.exports = Candidate ;
