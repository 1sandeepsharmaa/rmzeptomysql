import axios from "axios";
var BaseURL = "http://localhost:3000"
const getToken = () => ({
   authorization: sessionStorage.getItem("token")
})
class ApiServices {
   // getToken() {
   //    let obj = { authorization: sessionStorage.getItem("token") }
   //    return obj
   // }


   //Employee
   AddEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/add", data, { headers: getToken() })
   }
   GetAllEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/all", data, { headers: getToken() })
   }
   GetSingleEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/single", data, { headers: getToken() })
   }
   UpdateEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/update", data, { headers: getToken() })
   }
   DeleteEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/delete", data, { headers: getToken() })
   }
   ChangeStatusEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/changeStatus", data, { headers: getToken() })
   }

   //Facility Manager
   AddFm(data) {
      return axios.post(BaseURL + "/apis/fm/add", data, { headers: getToken() })
   }
   GetAllFm(data) {
      return axios.post(BaseURL + "/apis/fm/all", data, { headers: getToken() })
   }
   GetSingleFm(data) {
      return axios.post(BaseURL + "/apis/fm/single", data, { headers: getToken() })
   }
   UpdateFm(data) {
      return axios.post(BaseURL + "/apis/fm/update", data, { headers: getToken() })
   }
   DeleteFm(data) {
      return axios.post(BaseURL + "/apis/fm/delete", data, { headers: getToken() })
   }
   ChangeStatusFm(data) {
      return axios.post(BaseURL + "/apis/fm/changeStatus", data, { headers: getToken() })
   }
   ChangeDesignation(data) {
      return axios.post(BaseURL + "/apis/fm/changeDesignation", data, { headers: getToken() })
   }

   //CLM
   AddClm(data) {
      return axios.post(BaseURL + "/apis/clm/add", data, { headers: getToken() })
   }
   GetAllClm(data) {
      return axios.post(BaseURL + "/apis/clm/all", data, { headers: getToken() })
   }
   GetSingleClm(data) {
      return axios.post(BaseURL + "/apis/clm/single", data, { headers: getToken() })
   }
   UpdateClm(data) {
      return axios.post(BaseURL + "/apis/clm/update", data, { headers: getToken() })
   }
   DeleteClm(data) {
      return axios.post(BaseURL + "/apis/clm/delete", data, { headers: getToken() })
   }
   ChangeStatusClm(data) {
      return axios.post(BaseURL + "/apis/clm/changeStatus", data, { headers: getToken() })
   }

   //Zonal Head
   AddZh(data) {
      return axios.post(BaseURL + "/apis/zh/add", data, { headers: getToken() })
   }
   GetAllZh(data) {
      return axios.post(BaseURL + "/apis/zh/all", data, { headers: getToken() })
   }
   GetSingleZh(data) {
      return axios.post(BaseURL + "/apis/zh/single", data, { headers: getToken() })
   }
   UpdateZh(data) {
      return axios.post(BaseURL + "/apis/zh/update", data, { headers: getToken() })
   }
   DeleteZh(data) {
      return axios.post(BaseURL + "/apis/zh/delete", data, { headers: getToken() })
   }
   ChangeStatusZh(data) {
      return axios.post(BaseURL + "/apis/zh/changeStatus", data, { headers: getToken() })
   }

   //Business Finance
   AddBf(data) {
      return axios.post(BaseURL + "/apis/bf/add", data, { headers: getToken() })
   }
   GetAllBf(data) {
      return axios.post(BaseURL + "/apis/bf/all", data, { headers: getToken() })
   }
   GetSingleBf(data) {
      return axios.post(BaseURL + "/apis/bf/single", data, { headers: getToken() })
   }
   UpdateBf(data) {
      return axios.post(BaseURL + "/apis/bf/update", data, { headers: getToken() })
   }
   DeleteBf(data) {
      return axios.post(BaseURL + "/apis/bf/delete", data, { headers: getToken() })
   }
   ChangeStatusBf(data) {
      return axios.post(BaseURL + "/apis/bf/changeStatus", data, { headers: getToken() })
   }

   //Procurement
   AddProcurement(data) {
      return axios.post(BaseURL + "/apis/procure/add", data, { headers: getToken() })
   }
   GetAllProcurement(data) {
      return axios.post(BaseURL + "/apis/procure/all", data, { headers: getToken() })
   }
   GetSingleProcurement(data) {
      return axios.post(BaseURL + "/apis/procure/single", data, { headers: getToken() })
   }
   UpdateProcurement(data) {
      return axios.post(BaseURL + "/apis/procure/update", data, { headers: getToken() })
   }
   DeleteProcurement(data) {
      return axios.post(BaseURL + "/apis/procure/delete", data, { headers: getToken() })
   }
   ChangeStatusProcurement(data) {
      return axios.post(BaseURL + "/apis/procure/changeStatus", data, { headers: getToken() })
   }

   //Pr-Po
   AddPrPo(data) {
      return axios.post(BaseURL + "/apis/pr-po/add", data, { headers: getToken() })
   }
   GetAllPrPo(data) {
      return axios.post(BaseURL + "/apis/pr-po/all", data, { headers: getToken() })
   }
   GetSinglePrPo(data) {
      return axios.post(BaseURL + "/apis/pr-po/single", data, { headers: getToken() })
   }
   UpdatePrPo(data) {
      return axios.post(BaseURL + "/apis/pr-po/update", data, { headers: getToken() })
   }
   DeletePrPo(data) {
      return axios.post(BaseURL + "/apis/pr-po/delete", data, { headers: getToken() })
   }
   ChangeStatusPrPo(data) {
      return axios.post(BaseURL + "/apis/pr-po/changeStatus", data, { headers: getToken() })
   }

   //Zonal Commercial
   AddZonalCommercial(data) {
      return axios.post(BaseURL + "/apis/zonalCommercial/add", data, { headers: getToken() })
   }
   GetAllZonalCommercial(data) {
      return axios.post(BaseURL + "/apis/zonalCommercial/all", data, { headers: getToken() })
   }
   GetSingleZonalCommercial(data) {
      return axios.post(BaseURL + "/apis/zonalCommercial/single", data, { headers: getToken() })
   }
   UpdateZonalCommercial(data) {
      return axios.post(BaseURL + "/apis/zonalCommercial/update", data, { headers: getToken() })
   }
   DeleteZonalCommercial(data) {
      return axios.post(BaseURL + "/apis/zonalCommercial/delete", data, { headers: getToken() })
   }
   ChangeStatusZonalCommercial(data) {
      return axios.post(BaseURL + "/apis/zonalCommercial/changeStatus", data, { headers: getToken() })
   }

   //Missing Bridge
   AddMissingBridge(data) {
      return axios.post(BaseURL + "/apis/missingBridge/add", data, { headers: getToken() })
   }
   GetAllMissingBridge(data) {
      return axios.post(BaseURL + "/apis/missingBridge/all", data, { headers: getToken() })
   }
   GetSingleMissingBridge(data) {
      return axios.post(BaseURL + "/apis/missingBridge/single", data, { headers: getToken() })
   }
   UpdateMissingBridge(data) {
      return axios.post(BaseURL + "/apis/missingBridge/update", data, { headers: getToken() })
   }
   DeleteMissingBridge(data) {
      return axios.post(BaseURL + "/apis/missingBridge/delete", data, { headers: getToken() })
   }
   ChangeStatusMissingBridge(data) {
      return axios.post(BaseURL + "/apis/missingBridge/changeStatus", data, { headers: getToken() })
   }

   //Zone
   AddZone(data) {
      return axios.post(BaseURL + "/apis/zone/add", data, { headers: getToken() })
   }
   GetAllZone(data) {
      return axios.post(BaseURL + "/apis/zone/all", data, { headers: getToken() })
   }
   GetSingleZone(data) {
      return axios.post(BaseURL + "/apis/zone/single", data, { headers: getToken() })
   }
   UpdateZone(data) {
      return axios.post(BaseURL + "/apis/zone/update", data, { headers: getToken() })
   }
   DeleteZone(data) {
      return axios.post(BaseURL + "/apis/zone/delete", data, { headers: getToken() })
   }
   ChangeStatusZone(data) {
      return axios.post(BaseURL + "/apis/zone/changeStatus", data, { headers: getToken() })
   }

   //City
   AddCity(data) {
      return axios.post(BaseURL + "/apis/city/add", data, { headers: getToken() })
   }
   GetAllCity(data) {
      return axios.post(BaseURL + "/apis/city/all", data, { headers: getToken() })
   }
   GetSingleCity(data) {
      return axios.post(BaseURL + "/apis/city/single", data, { headers: getToken() })
   }
   UpdateCity(data) {
      return axios.post(BaseURL + "/apis/city/update", data, { headers: getToken() })
   }
   DeleteCity(data) {
      return axios.post(BaseURL + "/apis/city/delete", data, { headers: getToken() })
   }
   ChangeStatusCity(data) {
      return axios.post(BaseURL + "/apis/city/changeStatus", data, { headers: getToken() })
   }

   //State
   AddState(data) {
      return axios.post(BaseURL + "/apis/state/add", data, { headers: getToken() })
   }
   GetAllState(data) {
      return axios.post(BaseURL + "/apis/state/all", data, { headers: getToken() })
   }
   GetSingleState(data) {
      return axios.post(BaseURL + "/apis/state/single", data, { headers: getToken() })
   }
   UpdateState(data) {
      return axios.post(BaseURL + "/apis/state/update", data, { headers: getToken() })
   }
   DeleteState(data) {
      return axios.post(BaseURL + "/apis/state/delete", data, { headers: getToken() })
   }
   ChangeStatusState(data) {
      return axios.post(BaseURL + "/apis/state/changeStatus", data, { headers: getToken() })
   }

   //All States and Cities Api
   GetAllStates() {
      return axios.get("http://localhost:3000/apis/states", {
         headers: getToken(),
      });
   }

   GetCitiesByState(stateName) {
      return axios.post(
         "http://localhost:3000/apis/cities",
         { stateName },
         { headers: getToken() }
      );
   }



   //Store Category
   AddStoreCategory(data) {
      return axios.post(BaseURL + "/apis/storeCategory/add", data, { headers: getToken() })
   }
   GetAllStoreCategory(data) {
      return axios.post(BaseURL + "/apis/storeCategory/all", data, { headers: getToken() })
   }
   GetSingleStoreCategory(data) {
      return axios.post(BaseURL + "/apis/storeCategory/single", data, { headers: getToken() })
   }
   UpdateStoreCategory(data) {
      return axios.post(BaseURL + "/apis/storeCategory/update", data, { headers: getToken() })
   }
   DeleteStoreCategory(data) {
      return axios.post(BaseURL + "/apis/storeCategory/delete", data, { headers: getToken() })
   }
   ChangeStatusStoreCategory(data) {
      return axios.post(BaseURL + "/apis/storeCategory/changeStatus", data, { headers: getToken() })
   }

   //Store 
   AddStore(data) {
      return axios.post(BaseURL + "/apis/store/add", data, { headers: getToken() })
   }
   GetAllStore(data) {
      return axios.post(BaseURL + "/apis/store/all", data, { headers: getToken() })
   }
   GetSingleStore(data) {
      return axios.post(BaseURL + "/apis/store/single", data, { headers: getToken() })
   }
   UpdateStore(data) {
      return axios.post(BaseURL + "/apis/store/update", data, { headers: getToken() })
   }
   DeleteStore(data) {
      return axios.post(BaseURL + "/apis/store/delete", data, { headers: getToken() })
   }
   ChangeStatusStore(data) {
      return axios.post(BaseURL + "/apis/store/changeStatus", data, { headers: getToken() })
   }

   //Expense 
   AddExpense(data) {
      return axios.post(BaseURL + "/apis/expense/add", data, { headers: getToken() })
   }
   GetAllExpense(data) {
      return axios.post(BaseURL + "/apis/expense/all", data, { headers: getToken() })
   }
   GetSingleExpense(data) {
      return axios.post(BaseURL + "/apis/expense/single", data, { headers: getToken() })
   }
   ChangeStatusExpense(data) {
      return axios.post(BaseURL + "/apis/expense/changeStatus", data, { headers: getToken() })
   }
   MyExpenses(data) {
      return axios.post(BaseURL + "/apis/expense/myExpenses", data, { headers: getToken() })
   }

   //Expense Head
   AddExpenseHead(data) {
      return axios.post(BaseURL + "/apis/expenseHead/add", data, { headers: getToken() })
   }
   GetAllExpenseHead(data) {
      return axios.post(BaseURL + "/apis/expenseHead/all", data, { headers: getToken() })
   }
   GetSingleExpenseHead(data) {
      return axios.post(BaseURL + "/apis/expenseHead/single", data, { headers: getToken() })
   }
   UpdateExpenseHead(data) {
      return axios.post(BaseURL + "/apis/expenseHead/update", data, { headers: getToken() })
   }
   DeleteExpenseHead(data) {
      return axios.post(BaseURL + "/apis/expenseHead/delete", data, { headers: getToken() })
   }
   ChangeStatusExpenseHead(data) {
      return axios.post(BaseURL + "/apis/expenseHead/changeStatus", data, { headers: getToken() })
   }

   //Approval Policy
   AddApprovalPolicy(data) {
      return axios.post(BaseURL + "/apis/approvalPolicy/add", data, { headers: getToken() })
   }
   GetAllApprovalPolicy(data) {
      return axios.post(BaseURL + "/apis/approvalPolicy/all", data, { headers: getToken() })
   }
   GetSingleApprovalPolicy(data) {
      return axios.post(BaseURL + "/apis/approvalPolicy/single", data, { headers: getToken() })
   }
   UpdateApprovalPolicy(data) {
      return axios.post(BaseURL + "/apis/approvalPolicy/update", data, { headers: getToken() })
   }
   DeleteApprovalPolicy(data) {
      return axios.post(BaseURL + "/apis/approvalPolicy/delete", data, { headers: getToken() })
   }
   ChangeStatusApprovalPolicy(data) {
      return axios.post(BaseURL + "/apis/approvalPolicy/changeStatus", data, { headers: getToken() })
   }
   ApprovalHistory(payload) {
      return axios.post(BaseURL + "/apis/expense-approval/approval-history", payload, { headers: getToken() });
   }




   //Expense Approval
   ApproveExpense(data) {
      return axios.post(BaseURL + "/apis/expense-approval/approve", data, { headers: getToken() })
   }
   HoldExpense(data) {
      return axios.post(BaseURL + "/apis/expense-approval/hold", data, { headers: getToken() })
   }
   RejectExpense(data) {
      return axios.post(BaseURL + "/apis/expense-approval/reject", data, { headers: getToken() })
   }
   ExpenseHistory(data) {
      return axios.post(BaseURL + "/apis/expense-approval/history", data, { headers: getToken() })
   }
   GetClmPendingExpenses(data) {
      return axios.post(BaseURL + "/apis/expense-approval/clm/pending", data, { headers: getToken() })
   }
   GetZhPendingExpenses(data) {
      return axios.post(BaseURL + "/apis/expense-approval/zh/pending", data, { headers: getToken() })
   }
   GetBfPendingExpenses(data) {
      return axios.post(BaseURL + "/apis/expense-approval/bf/pending", data, { headers: getToken() })
   }
   GetProcurementPendingExpenses(data) {
      return axios.post(BaseURL + "/apis/expense-approval/procure/pending", data, { headers: getToken() })
   }
   GetPrPoPendingExpenses(data) {
      return axios.post(BaseURL + "/apis/expense-approval/pr-po/pending", data, { headers: getToken() })
   }
   ExpenseAction(data) {
      return axios.post(BaseURL + "/apis/expense-approval/action", data, { headers: getToken() })
   }
   MyApprovalActions(data) {
      return axios.post(BaseURL + "/apis/expense-approval/myApprovedAction", data, { headers: getToken() })
   }
   ReSubmitHeldExpense(data) {
      return axios.post(BaseURL + "/apis/expense-approval/reSubmitHeldExpense", data, { headers: getToken() })
   }
   AdminExpensesByStatus(data) {
      return axios.post(BaseURL + "/apis/expense-approval/adminExpensesByStatus", data, { headers: getToken() })
   }
   UploadWcrInvoice(data) {
      return axios.post(BaseURL + "/apis/expense-approval/uploadWcrInvoice", data, { headers: getToken() })
   }
   VerifyAndCloseExpense(data) {
      return axios.post(BaseURL + "/apis/expense-approval/verifyAndCloseExpense", data, { headers: getToken() })
   }
   ZcPendingExpense(data) {
      return axios.post(BaseURL + "/apis/expense-approval/zcPendingExpense", data, { headers: getToken() })
   }
   PrpoEmailAndClose(data) {
      return axios.post(BaseURL + "/apis/expense-approval/prpoEmailAndClose", data, { headers: getToken() })
   }


   //Announcement
   AddAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/add", data, { headers: getToken() })
   }
   GetAllAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/all", data, { headers: getToken() })
   }
   GetSingleAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/single", data, { headers: getToken() })
   }
   UpdateAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/update", data, { headers: getToken() })
   }
   DeleteAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/delete", data, { headers: getToken() })
   }
   ChangeStatusAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/changeStatus", data, { headers: getToken() })
   }

   //user Login, ChangePassword
   Login(data) {
      return axios.post(BaseURL + "/apis/user/login", data)
   }
   GetAllUser(data) {
      return axios.post(BaseURL + "/apis/user/all", data, { headers: getToken() })
   }
   GetSingleUser(data) {
      return axios.post(BaseURL + "/apis/user/single", data, { headers: getToken() })
   }
   ChangePassword(data) {
      return axios.post(BaseURL + "/apis/user/changePassword", data, { headers: getToken() })
   }

   //Dashboard
   // Dashboard() {
   //    return axios.post(BaseURL + "/apis/dashboard", null, { headers: getToken() })
   // }
   Dashboard() {
      return axios.get(BaseURL + "/apis/dashboard", { headers: getToken() });
   }

}

export default new ApiServices;