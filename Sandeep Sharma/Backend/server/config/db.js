const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/client_db")
.then(()=>{
    console.log("Database is Connected Successfully");
})
.catch((err)=>{
    console.log("Database is not Connected ",err);
})