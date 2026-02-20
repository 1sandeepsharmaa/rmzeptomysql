import { Link } from "react-router-dom";
export default function ZCSidebar() {
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
              to={"/ZonalCommercial"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-grid" />
              <span>Dashboard</span>
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/ZonalCommercial/viewAnnouncement"}
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
                <Link to={"/ZonalCommercial/approvedTickets"} onClick={handleSidebarClose}>
                  <i className="bi bi-check-circle fs-6" />
                  <span>Approved </span>
                </Link>
              </li>
              <li>
                <Link to={"/ZonalCommercial/pendingTickets"} onClick={handleSidebarClose}>
                  <i className="bi bi-clock fs-6" />
                  <span>Pending </span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End Expenses Nav */}
          
        </ul>
      </aside>
      {/* End Sidebar*/}
    </>
  );
}
