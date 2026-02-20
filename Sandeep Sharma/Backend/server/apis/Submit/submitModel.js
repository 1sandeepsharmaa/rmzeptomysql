const mongoose=require("mongoose")

const submitSchema=new mongoose.Schema({
    taskId:{type:mongoose.Schema.Types.ObjectId,ref:"taskData"},
    file:{type:String,default:""},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}
})

module.exports=new mongoose.model("submitData",submitSchema)