import { BrowserRouter, Route, Routes } from "react-router-dom"
import AdminMaster from "./layout/Admin Layout/AdminMaster"
import Master from "./layout/Employee Layout/Master"
// import AddCategory from "./Components/Admin/Department/AddDepartment"
import Login from "./Components/Login"
// import ManageCategory from "./Components/Admin/Department/ManageDepartment"
import NotFoundPage from "./Components/NotFoundPage"
import AddEmployee from "./Components/Admin/employee/AddEmployee"
import ManageEmployee from "./Components/Admin/employee/ManageEmployee"
import EditEmployee from "./Components/Admin/employee/EditEmployee"
import AdminDashboard from "./Components/Admin/AdminDashboard"
import BlockedEmployee from "./Components/Admin/employee/BlockedEmployee"
import AddZone from "./Components/Admin/Zone/AddZone"
import ManageZone from "./Components/Admin/Zone/ManageZone"
import BlockedZone from "./Components/Admin/Zone/BlockedZone"
import EditZone from "./Components/Admin/Zone/EditZone"
import AddCity from "./Components/Admin/City/AddCity"
import ManageCity from "./Components/Admin/City/ManageCity"
import BlockedCity from "./Components/Admin/City/BlockedCity"
import AddStoreCategory from "./Components/Admin/Store Category/AddStoreCategory"
import ManageStoreCategory from "./Components/Admin/Store Category/ManageStoreCategory"
import BlockedStoreCategory from "./Components/Admin/Store Category/BlockedStoreCategory"
import EditStoreCategory from "./Components/Admin/Store Category/EditStoreCategory"
import ManageStore from "./Components/Admin/Store/ManageStore"
import AddStore from "./Components/Admin/Store/AddStore"
import EditStore from "./Components/Admin/Store/EditStore"
import Redirect from "./layout/Redirect"
import FmMaster from "./layout/FM/FmMaster"
import AddExpenseHead from "./Components/Admin/Expense Head/AddExpenseHead"
import ManageExpenseHead from "./Components/Admin/Expense Head/ManageExpenseHead"
import EditExpenseHead from "./Components/Admin/Expense Head/EditExpenseHead"
import BlockedExpenseHead from "./Components/Admin/Expense Head/BlockedExpenseHead"
import ClmMaster from "./layout/CLM/ClmMaster"
import AddApprovalPolicy from "./Components/Admin/Approval Policy/AddApprovalPolicy"
import ManageApprovalPolicy from "./Components/Admin/Approval Policy/ManageApprovalPolicy"
import EditApprovalPolicy from "./Components/Admin/Approval Policy/EditApprovalPolicy"
import BlockedAppovalPolicy from "./Components/Admin/Approval Policy/BlockedApprovalPolicy"
import AddState from "./Components/Admin/State/AddState"
import ManageState from "./Components/Admin/State/ManageState"
import BlockedState from "./Components/Admin/State/BlockedState"
import EditState from "./Components/Admin/State/EditState"
import BlockedStore from "./Components/Admin/Store/BlockedStore"
import AddExpenses from "./Components/FM/Expenses/AddExpenses"
import PendingExpenses from "./Components/FM/Expenses/PendingExpenses"
import ApprovedExpenses from "./Components/FM/Expenses/ApprovedExpenses"
import HoldExpenses from "./Components/FM/Expenses/HoldExpenses"
import RejectedExpenses from "./Components/FM/Expenses/RejectedExpenses"
import FMProfile from "./Components/Profile/FMProfile"

import ClmApprovedExpenses from "./Components/CLM/Clm Expenses/ClmApprovedExpenses"
import ClmHoldExpenses from "./Components/CLM/Clm Expenses/ClmHoldExpenses"
import ClmPendingExpense from "./Components/CLM/Clm Expenses/ClmPendingExpense"
import ClmRejectedExpenses from "./Components/CLM/Clm Expenses/ClmRejectedExpenses"
import CLMProfile from "./Components/Profile/CLMProfile"

import ExpenseTracking from "./Components/FM/Expenses/ExpenseTrackingCard"
import TrackApproval from "./Components/FM/Expenses/TrackApproval"
import ZhMaster from "./layout/Zonal Head/ZhMaster"
import ZhApprovedExpenses from "./Components/Zonal_Head/Expenses/ZhApprovedExpenses"
import ZhHoldExpenses from "./Components/Zonal_Head/Expenses/ZhHoldExpenses"
import ZhPendingExpenses from "./Components/Zonal_Head/Expenses/ZhPendingExpense"
import ZhRejectedExpenses from "./Components/Zonal_Head/Expenses/ZhRejectedExpenses"
import BfMaster from "./layout/BF/BfMaster"
import ProcureMaster from "./layout/Procurement/ProcureMaster"
import BfApprovedExpenses from "./Components/Business_FInance/Expenses/BfApprovedExpenses"
import BfHoldExpense from "./Components/Business_FInance/Expenses/BfHoldExpenses"
import BfPendingExpense from "./Components/Business_FInance/Expenses/BfPendingExpense"
import BfRejectedExpense from "./Components/Business_FInance/Expenses/BfRejectedExpenses"
import ProcureApprovedExpenses from "./Components/Procurement/Expenses/ProcureApprovedExpenses"
import ProcureHoldExpenses from "./Components/Procurement/Expenses/ProcureHoldExpenses"
import ProcurePendingExpense from "./Components/Procurement/Expenses/ProcurePendingExpense"
import ProcureRejectedExpenses from "./Components/Procurement/Expenses/ProcureRejectedExpenses"
import EditCity from "./Components/Admin/City/EditCity"
import ZonalProfile from "./Components/Profile/ZonalProfile"
import AllPendingExpense from "./Components/Admin/Expenses/AllPendingExpense"
import AllApprovedExpense from "./Components/Admin/Expenses/AllApprovedExpense"
import AllHoldExpense from "./Components/Admin/Expenses/AllHoldExpense"
import AllRjectedExpense from "./Components/Admin/Expenses/AllRjectedExpense"
import ManageZonalHead from "./Components/Zonal_Head/manageZonalHead"
import ManageCLM from "./Components/CLM/ManageCLM"
import ManageFM from "./Components/FM/ManageFM"
import PRPOMaster from "./layout/PR_PO/PRPOMaster"
import PrPoPendingExpense from "./Components/PR_PO/Expenses/PrPoPendingExpense"
import PrPoApprovedExpense from "./Components/PR_PO/Expenses/PrPoApprovedExpense"
import PrPoRejectedExpense from "./Components/PR_PO/Expenses/PrPoRejectedExpense"
import PrPoHoldExpense from "./Components/PR_PO/Expenses/PrPoHoldExpense"
import ClosedExpenses from "./Components/FM/Expenses/ClosedExpenses"
import ZCMaster from "./layout/Zonal Commercial/ZCMaster"
import ZcPendingTickets from "./Components/Zonal_Commercial/ZcPendingTickets"
import ZcApprovedTickets from "./Components/Zonal_Commercial/ZcApprovedTickets"
import ManageBusinessFinance from "./Components/Business_FInance/ManageBusinessFinance"
import ManagePrPo from "./Components/PR_PO/ManagePrPo"
import ManageProcurement from "./Components/Procurement/ManageProcurement"
import ManageMissingBridge from "./Components/Admin/Missing_Bridge/ManageMissingBridge"
import ManageZonalCommercial from "./Components/Zonal_Commercial/ManageZonalCommercial"
import ZonalHeadDashboard from "./Components/Zonal_Head/ZonalHeadDashboard"
import AssignedRequests from "./Components/FM/Expenses/AssignedRequest"
import CLMDashboard from "./Components/CLM/ClmDashboard"
import BusinessFinanceDashboard from "./Components/Business_FInance/BusinessFinanceDashboard"
import ProcurementDashboard from "./Components/Procurement/ProcurementDashboard"
import PrPoDashboard from "./Components/PR_PO/PrPoDashboard"
import AllExpenses from "./Components/Admin/Expenses/AllExpenses"
import TodayRequests from "./Components/Admin/Expenses/TodayRequests"
import PrPoClosedExpense from "./Components/PR_PO/Expenses/PrPoClosedExpenses"
import AllClosedExpense from "./Components/Admin/Expenses/AllClosedExpense"
import ZcDashboard from "./Components/Zonal_Commercial/ZcDashboard"
import ZonalCommercialProfile from "./Components/Profile/PrPoProfile"
import BFProfile from "./Components/Profile/BFProfile"
import ProcurementProfile from "./Components/Profile/ProcurementProfile"
import PrPoProfile from "./Components/Profile/PrPoProfile"
import FacilityManagerDashboard from "./Components/FM/FacilityManagerDashboard"
import AdminProfile from "./Components/Admin/Profile/AdminProfile"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/redirect" element={<Redirect />} />
          <Route path="/admin" element={<AdminMaster />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/addEmployee" element={<AddEmployee />} />
            <Route path="/admin/manageEmployee" element={<ManageEmployee />} />
            <Route path="/admin/blockedEmployee" element={<BlockedEmployee />} />
            <Route path="/admin/editEmployee/:id" element={<EditEmployee />} />
            <Route path="/admin/zonalHead/" element={<ManageZonalHead />} />
            <Route path="/admin/CLMs/" element={<ManageCLM />} />
            <Route path="/admin/FMs/" element={<ManageFM />} />
            <Route path="/admin/Procurement/" element={<ManageProcurement />} />
            <Route path="/admin/prPo/" element={<ManagePrPo />} />
            <Route path="/admin/businessFinance/" element={<ManageBusinessFinance />} />
            <Route path="/admin/missingBridge/" element={<ManageMissingBridge />} />
            <Route path="/admin/zonalCommercial/" element={<ManageZonalCommercial />} />

            {/* Zone */}
            <Route path="/admin/addZone" element={<AddZone />} />
            <Route path="/admin/manageZone" element={<ManageZone />} />
            <Route path="/admin/blockedZone" element={<BlockedZone />} />
            <Route path="/admin/editZone/:id" element={<EditZone />} />

            {/* State */}
            <Route path="/admin/addState" element={<AddState />} />
            <Route path="/admin/manageState" element={<ManageState />} />
            <Route path="/admin/blockedState" element={<BlockedState />} />
            <Route path="/admin/editState/:id" element={<EditState />} />

            {/* City */}
            <Route path="/admin/addCity" element={<AddCity />} />
            <Route path="/admin/manageCity" element={<ManageCity />} />
            <Route path="/admin/blockedCity" element={<BlockedCity />} />
            <Route path="/admin/editCity/:id" element={<EditCity />} />

            {/* Store Category */}
            <Route path="/admin/addStoreCategory" element={<AddStoreCategory />} />
            <Route path="/admin/manageStoreCategory" element={<ManageStoreCategory />} />
            <Route path="/admin/blockedStoreCategory" element={<BlockedStoreCategory />} />
            <Route path="/admin/editStoreCategory/:id" element={<EditStoreCategory />} />

            {/* Store */}
            <Route path="/admin/addStore" element={<AddStore />} />
            <Route path="/admin/manageStore" element={<ManageStore />} />
            <Route path="/admin/blockedStore" element={<BlockedStore />} />
            <Route path="/admin/editStore/:id" element={<EditStore />} />

            {/* Expense Head */}
            <Route path="/admin/addExpenseHead" element={<AddExpenseHead />} />
            <Route path="/admin/manageExpenseHead" element={<ManageExpenseHead />} />
            <Route path="/admin/blockedExpenseHead" element={<BlockedExpenseHead />} />
            <Route path="/admin/editExpenseHead/:id" element={<EditExpenseHead />} />

            {/* Approval Policy */}
            <Route path="/admin/addApprovalPolicy" element={<AddApprovalPolicy />} />
            <Route path="/admin/manageApprovalPolicy" element={<ManageApprovalPolicy />} />
            <Route path="/admin/editApprovalPolicy/:id" element={<EditApprovalPolicy />} />
            <Route path="/admin/blockedApprovalPolicy" element={<BlockedAppovalPolicy />} />

            {/* Profile */}
            <Route path="/admin/myProfile" element={<AdminProfile />} />

            {/* Complaint Routes */}
            <Route path="/admin/allPendingExpenses" element={<AllPendingExpense />} />
            <Route path="/admin/allApprovedExpenses" element={<AllApprovedExpense />} />
            <Route path="/admin/allHoldExpenses" element={<AllHoldExpense />} />
            <Route path="/admin/allRejectedExpenses" element={<AllRjectedExpense />} />
            <Route path="/admin/allClosedExpenses" element={<AllClosedExpense />} />
            <Route path="/admin/allExpenses" element={<AllExpenses />} />
            <Route path="/admin/todayRequests" element={<TodayRequests />} />

          </Route>

          <Route path="/fm" element={<FmMaster />}>
            <Route path="/fm" element={<FacilityManagerDashboard />} />
            <Route path="/fm/addExpenses" element={<AddExpenses />} />
            <Route path="/fm/approvedExpenses" element={<ApprovedExpenses />} />
            <Route path="/fm/holdExpenses" element={<HoldExpenses />} />
            <Route path="/fm/assignedRequest" element={<AssignedRequests />} />
            <Route path="/fm/pendingExpenses" element={<PendingExpenses />} />
            <Route path="/fm/rejectedExpenses" element={<RejectedExpenses />} />
            <Route path="/fm/closedExpenses" element={<ClosedExpenses />} />
            <Route path="/fm/expenseTrackingCard/:id" element={<ExpenseTracking />} />
            <Route path="/fm/trackApproval" element={<TrackApproval />} />
            <Route path="/fm/fmProfile" element={<FMProfile />} />
          </Route>
          <Route path="/clm" element={<ClmMaster />}>
            <Route path="/clm" element={<CLMDashboard />} />
            <Route path="/clm/approvedExpenses" element={<ClmApprovedExpenses />} />
            <Route path="/clm/holdExpenses" element={<ClmHoldExpenses />} />
            <Route path="/clm/pendingExpenses" element={<ClmPendingExpense />} />
            <Route path="/clm/rejectedExpenses" element={<ClmRejectedExpenses />} />
            <Route path="/clm/clmProfile" element={<CLMProfile />} />
          </Route>
          <Route path="/ZonalHead" element={<ZhMaster />}>
            <Route path="/ZonalHead" element={<ZonalHeadDashboard />} />
            <Route path="/ZonalHead/approvedExpenses" element={<ZhApprovedExpenses />} />
            <Route path="/ZonalHead/holdExpenses" element={<ZhHoldExpenses />} />
            <Route path="/ZonalHead/pendingExpenses" element={<ZhPendingExpenses />} />
            <Route path="/ZonalHead/rejectedExpenses" element={<ZhRejectedExpenses />} />
            <Route path="/ZonalHead/zhprofile" element={<ZonalProfile />} />
          </Route>
          <Route path="/BusinessFinance" element={<BfMaster />}>
            <Route path="/BusinessFinance" element={<BusinessFinanceDashboard />} />
            <Route path="/BusinessFinance/approvedExpenses" element={<BfApprovedExpenses />} />
            <Route path="/BusinessFinance/holdExpenses" element={<BfHoldExpense />} />
            <Route path="/BusinessFinance/pendingExpenses" element={<BfPendingExpense />} />
            <Route path="/BusinessFinance/rejectedExpenses" element={<BfRejectedExpense />} />
             <Route path="/BusinessFinance/bfprofile" element={<BFProfile/>} />
          </Route>
          <Route path="/Procurement" element={<ProcureMaster />}>
            <Route path="/Procurement" element={<ProcurementDashboard />} />
            <Route path="/Procurement/approvedExpenses" element={<ProcureApprovedExpenses />} />
            <Route path="/Procurement/holdExpenses" element={<ProcureHoldExpenses />} />
            <Route path="/Procurement/pendingExpenses" element={<ProcurePendingExpense />} />
            <Route path="/Procurement/rejectedExpenses" element={<ProcureRejectedExpenses />} />
             <Route path="/Procurement/procurementprofile" element={<ProcurementProfile/>} />
          </Route>
          <Route path="/PR_PO" element={<PRPOMaster />}>
            <Route path="/PR_PO" element={<PrPoDashboard />} />
            <Route path="/PR_PO/pendingExpenses" element={<PrPoPendingExpense />} />
            <Route path="/PR_PO/holdExpenses" element={<PrPoHoldExpense />} />
            <Route path="/PR_PO/approvedExpenses" element={<PrPoApprovedExpense />} />
            <Route path="/PR_PO/rejectedExpenses" element={<PrPoRejectedExpense />} />
            <Route path="/PR_PO/closedExpenses" element={<PrPoClosedExpense />} />
             <Route path="/PR_PO/prprprofile" element={<PrPoProfile/>} />

          </Route>

          <Route path="/ZonalCommercial" element={<ZCMaster />}>
            <Route path="/ZonalCommercial" element={<ZcDashboard />} />
            <Route path="/ZonalCommercial/pendingTickets" element={<ZcPendingTickets />} />
            <Route path="/ZonalCommercial/approvedTickets" element={<ZcApprovedTickets />} />
            <Route path="/ZonalCommercial/zcprofile" element={<ZonalCommercialProfile/>} />

          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
