const routes = require("express").Router()
const employeeModel = require("../apis/Employee/employeeController")
const userController = require("../apis/User/userController")
const zhController = require("../apis/Zonal Head/zonalHeadController")
const clmController = require("../apis/CLM/clmController")
const fmController = require("../apis/Facility Manager/facilityManagerController")
const bfController = require("../apis/Business Finance/businessFinanceController")
const procureController = require("../apis/Procurement/procurementController")
const prpoController = require("../apis/PrPo/PrPoController")
const zonalCommercialController = require("../apis/Zonal Commercial/zonalCommercialController")
const missingBridgeController = require("../apis/Missing Bridge/missingBridgeController")
const zoneController = require("../apis/Zone/zoneController")
const cityController = require("../apis/City/cityController")
const storeCategoryController = require("../apis/Store Category/storeCategoryController")
const storeController = require("../apis/Store/storeController")
const expenseController = require("../apis/Expense/expenseController")
const expenseHeadController = require("../apis/ExpenseHead/expenseHeadController")
const approvalPolicyController = require("../apis/Approval Policy/approvalPolicyController")
const stateController = require("../apis/State/stateController")
const locationController = require("../apis/City/locationController")
const expenseApprovalController = require("../apis/Expense Approval/expenseApprovalController")
const adminDashboardController = require("../apis/Dashboard/adminDashboardController")
const fmDashboardController = require("../apis/Dashboard/fmDashboardController")
const zhDashboardController = require("../apis/Dashboard/zhDashboardController");

// const multer = require("multer")
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

const upload = require("../middleware/upload");

//login
routes.post("/user/login", userController.login)

// Token checker
routes.use(require("../middleware/tokenChecker"))

// Employee Model
routes.post("/employee/add", employeeModel.add)
routes.post("/employee/all", employeeModel.getAll)
routes.post("/employee/single", employeeModel.getSingle)
routes.post("/employee/update", employeeModel.updateEmp)
routes.post("/employee/delete", employeeModel.delEmployee)
routes.post("/employee/changeStatus", employeeModel.changeStatus)

// User Model
routes.post("/user/all", userController.getAll)
routes.post("/user/single", userController.getSingle)
routes.post("/user/changePassword", userController.changePassword)

// Zonal Head
routes.post("/zh/add", zhController.add)
routes.post("/zh/all", zhController.getAll)
routes.post("/zh/single", zhController.getSingle)
routes.post("/zh/update", zhController.updateZh)
routes.post("/zh/delete", zhController.delzh)
routes.post("/zh/changeStatus", zhController.changeStatus)

// CLM
routes.post("/clm/add", clmController.add)
routes.post("/clm/all", clmController.getAll)
routes.post("/clm/single", clmController.getSingle)
routes.post("/clm/update", clmController.updateClm)
routes.post("/clm/delete", clmController.delclm)
routes.post("/clm/changeStatus", clmController.changeStatus)

// Facility Manager
routes.post("/fm/add", fmController.add)
routes.post("/fm/all", fmController.getAll)
routes.post("/fm/single", fmController.getSingle)
routes.post("/fm/update", fmController.updateFm)
routes.post("/fm/delete", fmController.delfm)
routes.post("/fm/changeStatus", fmController.changeStatus)
routes.post("/fm/changeDesignation", fmController.changeDesignation)

// Business Finance
routes.post("/bf/add", bfController.add)
routes.post("/bf/all", bfController.getAll)
routes.post("/bf/single", bfController.getSingle)
routes.post("/bf/update", bfController.updateBf)
routes.post("/bf/delete", bfController.delbf)
routes.post("/bf/changeStatus", bfController.changeStatus)

// Procurement
routes.post("/procure/add", procureController.add)
routes.post("/procure/all", procureController.getAll)
routes.post("/procure/single", procureController.getSingle)
routes.post("/procure/update", procureController.updatePr)
routes.post("/procure/delete", procureController.delprocure)
routes.post("/procure/changeStatus", procureController.changeStatus)

// Pr/Po
routes.post("/pr-po/add", prpoController.add)
routes.post("/pr-po/all", prpoController.getAll)
routes.post("/pr-po/single", prpoController.getSingle)
routes.post("/pr-po/update", prpoController.updatePrPo)
routes.post("/pr-po/delete", prpoController.delPrPo)
routes.post("/pr-po/changeStatus", prpoController.changeStatus)

// Zonal Commercial
routes.post("/zonalCommercial/add", zonalCommercialController.add)
routes.post("/zonalCommercial/all", zonalCommercialController.getAll)
routes.post("/zonalCommercial/single", zonalCommercialController.getSingle)
routes.post("/zonalCommercial/update", zonalCommercialController.updateZonalCommercial)
routes.post("/zonalCommercial/delete", zonalCommercialController.delZonalCommercial)
routes.post("/zonalCommercial/changeStatus", zonalCommercialController.changeStatus)

// Missing Bridge
routes.post("/missingBridge/add", missingBridgeController.add)
routes.post("/missingBridge/all", missingBridgeController.getAll)
routes.post("/missingBridge/single", missingBridgeController.getSingle)
routes.post("/missingBridge/update", missingBridgeController.updateMissingBridge)
routes.post("/missingBridge/delete", missingBridgeController.delMissingBridge)
routes.post("/missingBridge/changeStatus", missingBridgeController.changeStatus)

// Zone
routes.post("/zone/add", zoneController.add)
routes.post("/zone/all", zoneController.getAll)
routes.post("/zone/single", zoneController.getSingle)
routes.post("/zone/update", zoneController.update)
routes.post("/zone/delete", zoneController.delZone)
routes.post("/zone/changeStatus", zoneController.changeStatus)

// State
routes.post("/state/add", stateController.add)
routes.post("/state/all", stateController.getAll)
routes.post("/state/single", stateController.getSingle)
routes.post("/state/update", stateController.update)
routes.post("/city/delete", stateController.delState)
routes.post("/state/changeStatus", stateController.changeStatus)

// City
routes.post("/city/add", cityController.add)
routes.post("/city/all", cityController.getAll)
routes.post("/city/single", cityController.getSingle)
routes.post("/city/update", cityController.update)
routes.post("/city/delete", cityController.delCity)
routes.post("/city/changeStatus", cityController.changeStatus)

//state and city api
routes.get("/states", locationController.getStatesOfIndia);
routes.post("/cities", locationController.getCitiesByState);

// Store Category
routes.post("/storeCategory/add", storeCategoryController.add)
routes.post("/storeCategory/all", storeCategoryController.getAll)
routes.post("/storeCategory/single", storeCategoryController.getSingle)
routes.post("/storeCategory/update", storeCategoryController.update)
routes.post("/storeCategory/delete", storeCategoryController.delStoreCategory)
routes.post("/storeCategory/changeStatus", storeCategoryController.changeStatus)

// Store 
routes.post("/store/add", storeController.add)
routes.post("/store/all", storeController.getAll)
routes.post("/store/single", storeController.getSingle)
routes.post("/store/update", storeController.update)
routes.post("/store/delete", storeController.delStore)
routes.post("/store/changeStatus", storeController.changeStatus)

// Expense 
routes.post("/expense/add", upload.array("attachment", 5), expenseController.add)
routes.post("/expense/all", expenseController.getAll)
routes.post("/expense/single", expenseController.getSingle)
// routes.post("/expense/changeStatus",expenseController.changeStatus)
routes.post("/expense/myExpenses", expenseController.myExpenses)
// routes.post("/expense/pending",expenseController.pendingReq)
// routes.post("/expense/approved",expenseController.approve)
// routes.post("/expense/hold",expenseController.hold)
// routes.post("/expense/reject",expenseController.reject)

// Expense Head
routes.post("/expenseHead/add", expenseHeadController.add)
routes.post("/expenseHead/all", expenseHeadController.getAll)
routes.post("/expenseHead/single", expenseHeadController.getSingle)
routes.post("/expenseHead/update", expenseHeadController.update)
routes.post("/expenseHead/delete", expenseHeadController.delExpenseHead)
routes.post("/expenseHead/changeStatus", expenseHeadController.changeStatus)

// Approval policy
routes.post("/approvalPolicy/add", approvalPolicyController.add)
routes.post("/approvalPolicy/all", approvalPolicyController.getAll)
routes.post("/approvalPolicy/single", approvalPolicyController.getSingle)
routes.post("/approvalPolicy/update", approvalPolicyController.update)
routes.post("/approvalPolicy/delete", approvalPolicyController.delApprovalPolicy)
routes.post("/approvalPolicy/changeStatus", approvalPolicyController.changeStatus)

//Expense Approval
const prpoUpload = upload.fields([
    { name: "prAttachment", maxCount: 1 },
    { name: "poAttachment", maxCount: 1 }
]);

routes.post(
    "/expense-approval/approve",
    prpoUpload,
    expenseApprovalController.approveExpense
);

routes.post(
    "/expense-approval/hold",
    prpoUpload,
    expenseApprovalController.holdExpense
);

routes.post(
    "/expense-approval/reject",
    prpoUpload,
    expenseApprovalController.rejectExpense
);


routes.post("/expense-approval/history", expenseApprovalController.approvalHistory)
routes.post("/expense-approval/clm/pending", expenseApprovalController.clmPendingExpenses)
routes.post("/expense-approval/zh/pending", expenseApprovalController.pendingForZH)
routes.post("/expense-approval/bf/pending", expenseApprovalController.pendingForBF)
routes.post("/expense-approval/procure/pending", expenseApprovalController.pendingForProcurement)
routes.post("/expense-approval/pr-po/pending", expenseApprovalController.prpoPendingExpenses)
routes.post("/expense-approval/action", expenseApprovalController.expenseAction)
routes.post("/expense-approval/myApprovedAction", expenseApprovalController.myApprovalActions)
routes.post(
    "/expense-approval/reSubmitHeldExpense",
    upload.single("resubmittedAttachment"),
    expenseApprovalController.resubmitHeldExpense
);

routes.post("/expense-approval/approval-history", expenseApprovalController.approvalHistory);
routes.post("/expense-approval/adminExpensesByStatus", expenseApprovalController.adminExpensesByStatus);
routes.post("/expense-approval/verifyAndCloseExpense", expenseApprovalController.verifyAndCloseExpense);
routes.post(
    "/expense-approval/uploadWcrInvoice",
    upload.fields([
        { name: "wcrAttachment", maxCount: 1 },
        { name: "invoiceAttachment", maxCount: 1 }
    ]),
    expenseApprovalController.uploadWcrInvoice
);

routes.post("/expense-approval/zcPendingExpense", expenseApprovalController.zonalCommercialPending);
routes.post("/expense-approval/prpoEmailAndClose", expenseApprovalController.prpoEmailAndClose);


// Dashboard
routes.get("/dashboard", adminDashboardController.getDashboard)
routes.get("/fm/dashboard", fmDashboardController.getFMDashboard)
routes.get("/zh/dashboard", zhDashboardController.getZHDashboard);

module.exports = routes