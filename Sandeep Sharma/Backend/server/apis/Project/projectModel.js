const mongoose=require("mongoose")

const projectSchema=new mongoose.Schema({
    name:{type:String,default:""},
    description:{type:String,default:""},
    attachment:{type:String,default:""},
    client:{type:String,default:""}, 
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:"categoryData"},
    subCategoryId:{type:mongoose.Schema.Types.ObjectId,ref:"subCategoryData"},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()},

})

module.exports=new mongoose.model("projectData",projectSchema)
