const mongoose =require("mongoose")

const employeeSchema=new mongoose.Schema({
    name:{type:String,default:""},
    email:{type:String,default:""},
    contact:{type:String,default:""},
    picture:{type:String,default:""},
    jobTitle:{type:String,default:""},
    linkedin:{type:String,default:""},
    github:{type:String,default:""},
    userId:{type:String,default:""},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()},
})

module.exports=new mongoose.model("employeeData",employeeSchema)