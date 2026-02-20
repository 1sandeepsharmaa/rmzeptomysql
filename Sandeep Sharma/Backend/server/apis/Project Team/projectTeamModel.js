const mongoose =require("mongoose")

const projctTeamSchema=new mongoose.Schema({
    projectId:{type:mongoose.Schema.Types.ObjectId,ref:"projectData"},
    employeeId:[{type:mongoose.Schema.Types.ObjectId,ref:"employeeData"}],
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}
})

module.exports=new mongoose.model("proejctTeamData",projctTeamSchema)