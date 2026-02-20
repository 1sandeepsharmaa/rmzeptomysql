const mongoose=require("mongoose")

const taskSchema=new mongoose.Schema({
    projectId:{type:mongoose.Schema.Types.ObjectId,ref:"projectData"},
    employeeId:{type:mongoose.Schema.Types.ObjectId,ref:"employeeData"},
    subCategoryId:{type:mongoose.Schema.Types.ObjectId,ref:"subCategoryData"},
    title:{type:String,default:"No Titile"},
    description:{type:String,default:"No Description"},
    attachment:{type:String,default:"No File attached "},
    deadline:{type:String,default:"No Deadline"},
    progress:{type:String,enum: ['Not Started', 'In Progress', 'Completed'],default:"Not Started"},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()},

})


module.exports=new mongoose.model("taskData",taskSchema)