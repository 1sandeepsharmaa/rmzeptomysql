const routes=require("express").Router()

const categoryController=require("../apis/Category/categoryController")
const subCategoryController=require("../apis/Subcategory/subCategoryController")
const projectController=require("../apis/Project/projectController")
const projectTeamController=require("../apis/Project Team/projectTeamController")
const submitController=require("../apis/Submit/submitController")
const coinController=require("../apis/Coins/coinController")
const taskController=require("../apis/Task/taskController")
const employeeController=require("../apis/Employee/employeeController")
const userController=require("../apis/User/userController")
const dashboardController=require("../apis/Dashboard/dashboardController")

const multer=require("multer")
const storage=multer.memoryStorage()
const upload=multer({storage:storage})


//login
routes.post("/user/login",userController.login)

//admin token checker
routes.use(require("../middleware/adminTokenChecker"))

//dashboard
routes.post("/dashboard",dashboardController.dashboard)


//category
routes.post("/category/add",categoryController.add)
routes.post("/category/getAll",categoryController.getAll)
routes.post("/category/getSingle",categoryController.getSingle)
routes.post("/category/update",categoryController.update)
routes.post("/category/delete",categoryController.delCategory)
routes.post("/category/changeStatus",categoryController.changeStatus)

//subCategory
routes.post("/subCategory/add",subCategoryController.add)
routes.post("/subCategory/getAll",subCategoryController.getAll)
routes.post("/subCategory/getSingle",subCategoryController.getSingle)
routes.post("/subCategory/update",subCategoryController.update)
routes.post("/subCategory/delete",subCategoryController.delSubCategory)
routes.post("/subCategory/changeStatus",subCategoryController.changeStatus)

//project
routes.post("/project/add",upload.single("attachment"),projectController.add)
routes.post("/project/getAll",projectController.getAll)
routes.post("/project/getSingle",projectController.getSingle)
routes.post("/project/update",upload.single("attachment"),projectController.update)
routes.post("/project/delete",projectController.delProject)
routes.post("/project/changeStatus",projectController.changeStatus)

//project team
routes.post("/projectTeam/add",projectTeamController.add)
routes.post("/projectTeam/getAll",projectTeamController.getAll)
routes.post("/projectTeam/getSingle",projectTeamController.getSingle)
routes.post("/projectTeam/update",projectTeamController.update)
routes.post("/projectTeam/delete",projectTeamController.delProject)
routes.post("/projectTeam/changeStatus",projectTeamController.changeStatus)

//coin
routes.post("/coin/add",coinController.add)
routes.post("/coin/getAll",coinController.getAll)
routes.post("/coin/getSingle",coinController.getSingle)
routes.post("/coin/update",coinController.update)
routes.post("/coin/delete",coinController.delCoin)
routes.post("/coin/changeStatus",coinController.changeStatus)

//task
routes.post("/task/add",upload.single("attachment"),taskController.add)
routes.post("/task/getAll",taskController.getAll)
routes.post("/task/getSingle",taskController.getSingle)
routes.post("/task/update",upload.single("attachment"),taskController.update)
routes.post("/task/delete",taskController.delTask)
routes.post("/task/changeStatus",taskController.changeStatus)

//Employee
routes.post("/employee/add",upload.single("picture"),employeeController.add)
routes.post("/employee/getAll",employeeController.getAll)
routes.post("/employee/getSingle",employeeController.getSingle)
routes.post("/employee/update",upload.single("picture"),employeeController.update)
routes.post("/employee/delete",employeeController.delEmployee)
routes.post("/employee/changeStatus",employeeController.changeStatus)


//submit
routes.post("/submit/add",upload.single("file"),submitController.add)
routes.post("/submit/getAll",submitController.getAll)
routes.post("/submit/getSingle",submitController.getSingle)
routes.post("/submit/update",upload.single("file"),submitController.update)
routes.post("/submit/delete",submitController.delSubmit)
routes.post("/submit/changeStatus",submitController.changeStatus)

//user 

routes.post("/user/getAll",userController.getAll)
routes.post("/user/getSingle",userController.getSingle)
routes.post("/user/changePassword",userController.changePassword)


module.exports=routes