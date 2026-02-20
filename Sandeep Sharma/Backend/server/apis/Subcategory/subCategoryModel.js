const mongoose=require("mongoose")

const subCategorySchema=new mongoose.Schema({
    name:{type:String,default:""},
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:"categoryData"},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()},
})

module.exports=new mongoose.model("subCategoryData",subCategorySchema)