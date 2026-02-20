const mongoose=require("mongoose")

const coinsSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"userData"},
    taskId:{type:mongoose.Schema.Types.ObjectId,ref:"taskData"},
    message:{type:String,default:""},
    coinCount:{type:Number,default:0},
    type:{type:String,enum: ["Reward", "Warning"],  default: ""},//reward/warning
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()},

})

module.exports=new mongoose.model("coinsData",coinsSchema)