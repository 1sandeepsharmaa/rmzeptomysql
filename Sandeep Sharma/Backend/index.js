const express=require("express")
const app=express()
const port=9610

const seeder=require("./server/config/seeder")
seeder.adminReg()

app.use(express.urlencoded({extended:true}))
app.use(express.json({limit:'40mb'}))

const db=require("./server/config/db")

const cors = require('cors');
app.use(cors());

const adminRoutes=require("./server/routes/adminRoutes")
app.use("/admin",adminRoutes)

const apiRoutes=require("./server/routes/apiRoutes")
app.use("/apis",apiRoutes)



app.listen(port,(err)=>{
    if(err){
        console.log("Server is not Connected");
    }
    else{
        console.log("Server is Connected on port",port);  
    }
})