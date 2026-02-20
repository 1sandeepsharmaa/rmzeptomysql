import { Link } from "react-router-dom";
export default function PRPOSidebar() {
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
        <ul className="sidebar-nav" id="sidebar-nav" style={{ cursor: "default" }}>
          {/* Start Dashboard Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/PR_PO"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-grid" />
              <span>Dashboard</span>
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/PR_PO/viewAnnouncement"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-megaphone" />
              <span>Announcement</span>
            </Link>
          </li> */}
          {/* End Dashboard Nav */}


          {/* Start Expense Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#complaint-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-wallet2" />
              <span>Expenses</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>
            <ul
              id="complaint-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/PR_PO/approvedExpenses"} onClick={handleSidebarClose}>
                  <i className="bi bi-check-circle fs-6" />
                  <span>Approved </span>
                </Link>
              </li>
              <li>
                <Link to={"/PR_PO/pendingExpenses"} onClick={handleSidebarClose}>
                  <i className="bi bi-clock fs-6" />
                  <span>Pending </span>
                </Link>
              </li>
              <li>
                <Link to={"/PR_PO/holdExpenses"} onClick={handleSidebarClose}>
                  <i className="bi bi-pause-circle fs-6" />
                  <span>Hold </span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/PR_PO/rejectedExpenses"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-x-circle fs-6" />
                  <span>Rejected</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/PR_PO/closedExpenses"}
                  onClick={handleSidebarClose}
                >
                  <i className="bi bi-door-closed fs-6" />
                  <span>Closed Expenses</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End Expenses Nav */}
          {/* <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/employee/dailyProgress"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-clipboard-check" />
              <span>History</span>
            </Link>
          </li> */}
          {/* <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/employee/myProfile"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-person" />
              <span>My Profile</span>
            </Link>
          </li> */}
        </ul>
      </aside>
      {/* End Sidebar*/}
    </>
  );
}
