const categoryModel = require("../Category/categoryModel")
const subCategoryModel = require("../Subcategory/subCategoryModel")
const employeeModel = require("../Employee/employeeModel")
const projectModel = require("../Project/projectModel")
const projectTeamModel = require("../Project Team/projectTeamModel")
const taskModel = require("../Task/taskModel")

const dashboard =async (req, res) => {
    let totalCategories = 0
    let totalSubCategories = 0
    let totalEmployee = 0
    let totalProject = 0
    let totalProjectTeam = 0
    let totalTask = 0

   await categoryModel.countDocuments()
        .then((totalCat) => {
            totalCategories = totalCat
        })
    await subCategoryModel.countDocuments()
        .then((totalSubCat) => {
            totalSubCategories = totalSubCat
        })
    await employeeModel.countDocuments()
        .then((totalEmp) => {
            totalEmployee = totalEmp
        })
   await projectModel.countDocuments()
        .then((totalProj) => {
            totalProject = totalProj
        })
   await projectTeamModel.countDocuments()
        .then((totalProjTeam) => {
            totalProjectTeam = totalProjTeam
        })
   await taskModel.countDocuments()
        .then((totalTasks) => {
            totalTask = totalTasks
        })
        
          res.send({
            status:200,
            success:true,
            message:"Dashboard loaded!!",
            totalCategories,
            totalSubCategories,
            totalEmployee,
            totalProject,
            totalProjectTeam,
            totalTask
        })

}
module.exports={dashboard}