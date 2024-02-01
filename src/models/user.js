const mongoose = require('mongoose')
const bycrpt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username : {
        type : String ,
         required : true,
         unique :  true  
        },
    password : {
        type :String ,
        required : true  
    },
    usertype : {
        type : String ,
        required  : true ,
        enum : ["admin" , "kkem"]
    }
})
userSchema.pre('save' , async function (next){
    try{
        if(!this.isModified('password')){
            return next();
        }
        const hashedPassword = await bycrpt.hash(this.password , 10);
        this.password = hashedPassword ;
        next();
    }
    catch(error){
        return next(error);
    }
}) 

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel ; 