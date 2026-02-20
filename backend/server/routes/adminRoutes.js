const routes = require("express").Router();
const adminSheetController = require("../apis/Admin/adminSheetController")
const fmControllr=require("../apis/Facility Manager/facilityManagerController")


routes.get("/export-sheet", adminSheetController.exportExpenseCSV);
routes.use(require("../middleware/adminTokenChecker"));


routes.post("/all", fmControllr.getAll);


module.exports = routes;