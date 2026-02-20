const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{type:String,default:""},
    email:{type:String,default:""},
    password:{type:String,default:""},
    userType:{type:Number,default:2}, //1- Admin, 2- Employee
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()},
})

module.exports=new mongoose.model("userData",userSchema)