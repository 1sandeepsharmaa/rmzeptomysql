import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ApiServices from "../../ApiServices";
import axios from "axios";
export default function AdminSidebar() {
  const handleSidebarClose = () => {
    if (window.innerWidth <= 1024) {
      document.body.classList.remove("toggle-sidebar"); // if you're toggling class on body
      document.getElementById("sidebar").classList.remove("active"); // if you're toggling class on sidebar
    }
  };
  return (
    <>
      {/* ======= Sidebar ======= */}
      <aside id="sidebar" className="sidebar">
        <ul
          className="sidebar-nav"
          id="sidebar-nav"
          style={{ cursor: "default" }}
        >
          {/* Start Dashboard Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/admin"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-grid" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#zone-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-globe" />
              <span>Zone</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="zone-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/admin/addZone"} onClick={handleSidebarClose}>
                  <i className="bi bi-plus fs-5" />
                  <span>Add Zone</span>
                </Link>
              </li>
              <li>
                <Link to={"/admin/manageZone"} onClick={handleSidebarClose}>
                  <i className="bi bi-card-list fs-6" />
                  <span>Manage Zone</span>
                </Link>
              </li>
              <li>
                <Link to={"/admin/blockedZone"} onClick={handleSidebarClose}>
                  <i className="bi bi-slash-circle text-danger fs-6" />
                  <span>Blocked Zone</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End Zone Nav */}

          {/* Start State Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#state-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-map" />
              <span>State</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="state-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/admin/addState"} onClick={handleSidebarClose}>
                  <i className="bi bi-plus fs-5" />
                  <span>Add State</span>
                </Link>
              </li>
              <li>
                <Link to={"/admin/manageState"} onClick={handleSidebarClose}>
                  <i className="bi bi-card-list fs-6" />
                  <span>Manage State</span>
                </Link>
              </li>
              <li>
                <Link to={"/admin/blockedState"} onClick={handleSidebarClose}>
                  <i className="bi bi-slash-circle text-danger fs-6" />
                  <span>Blocked State</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End State Nav */}

          {/* Start City Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#city-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-geo-alt" />
              <span>City</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="city-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/admin/addCity"} onClick={handleSidebarClose}>
                  <i className="bi bi-plus fs-5" />
                  <span>Add City</span>
                </Link>
              </li>
              <li>
                <Link to={"/admin/manageCity"} onClick={handleSidebarClose}>
                  <i className="bi bi-card-list fs-6" />
                  <span>Manage City</span>
                </Link>
              </li>
              <li>
                <Link to={"/admin/blockedCity"} onClick={handleSidebarClose}>
                  <i className="bi bi-slash-circle text-danger  fs-6" />
                  <span>Blocked City</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End City Nav */}

          {/* Start Store Category Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#StoreCategory-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-tags" />
              <span>Store Category</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="StoreCategory-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link
                  to={"/admin/addStoreCategory"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-plus fs-5" />
                  <span>Add Store Category</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/manageStoreCategory"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-card-list fs-6" />
                  <span>Manage Store Category</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/blockedStoreCategory"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-slash-circle text-danger  fs-6" />
                  <span>Blocked Store Category</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End Store Category Nav */}

          {/* Start Store  Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#Store-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-shop" />
              <span>Store</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="Store-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/admin/addStore"} onClick={handleSidebarClose}>
                  <i className="bi bi-plus fs-5" />
                  <span>Add Store</span>
                </Link>
              </li>
              <li>
                <Link to={"/admin/manageStore"} onClick={handleSidebarClose}>
                  <i className="bi bi-card-list fs-6" />
                  <span>Manage Store</span>
                </Link>
              </li>
              <li>
                <Link to={"/admin/blockedStore"} onClick={handleSidebarClose}>
                  <i className="bi bi-slash-circle text-danger  fs-6" />
                  <span>Blocked Store </span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End Store  Nav */}

          {/* Start Expense Head  Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#ExpenseHead-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-receipt" />
              <span>Expense Head</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="ExpenseHead-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/admin/addExpenseHead"} onClick={handleSidebarClose}>
                  <i className="bi bi-plus fs-5" />
                  <span>Add Expense Head</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/manageExpenseHead"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-card-list fs-6" />
                  <span>Manage Expense Head</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/blockedExpenseHead"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-slash-circle text-danger  fs-6" />
                  <span>Blocked Expense Head</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End Expense Head Nav */}
          {/* Start Approval Policy  Nav */}
          {/* paarth */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#ApprovalPolicy-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-check-circle" />
              <span>Approval Policy</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="ApprovalPolicy-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link
                  to={"/admin/addApprovalPolicy"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-plus fs-5" />
                  <span>Add Approval Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/manageApprovalPolicy"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-card-list fs-6" />
                  <span>Manage Approval Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/blockedApprovalPolicy"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-slash-circle text-danger  fs-6" />
                  <span>Blocked Approval Policy</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End Approval Policy Nav */}

          {/* Start Employee Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#employee-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-person-vcard" />
              <span>Employee</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="employee-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/admin/addEmployee"} onClick={handleSidebarClose}>
                  <i className="bi bi-plus fs-5" />
                  <span>Add Employee</span>
                </Link>
              </li>
              <li>
                <Link to={"/admin/manageEmployee"} onClick={handleSidebarClose}>
                  <i className="bi bi-card-list fs-6" />
                  <span>Manage Employee</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/BlockedEmployee"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-slash-circle text-danger  fs-6" />
                  <span>Blocked Employee</span>
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#complaint-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-cash-stack" />
              <span>Expenses</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="complaint-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link
                  to={"/admin/allApprovedExpenses"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-check-circle fs-6" />
                  <span>Approved Expenses</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/allPendingExpenses"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-hourglass-split fs-6" />
                  <span>Pending Expenses</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/allHoldExpenses"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-pause-circle fs-6" />
                  <span>Hold Expenses</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/allRejectedExpenses"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-x-circle fs-6" />
                  <span>Rejected Expenses</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/allClosedExpenses"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-door-closed fs-6" />
                  <span>Closed Expenses</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End Employee Nav */}
        </ul>
      </aside>
      {/* End Sidebar*/}
    </>
  );
}