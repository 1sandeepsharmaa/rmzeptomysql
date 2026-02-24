import { Link } from "react-router-dom";

export default function ViewerSidebar() {
    const handleSidebarClose = () => {
        if (window.innerWidth <= 1024) {
            document.body.classList.remove("toggle-sidebar");
            const sidebar = document.getElementById("sidebar");
            if (sidebar) sidebar.classList.remove("active");
        }
    };

    return (
        <>
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav" style={{ cursor: "default" }}>

                    <li className="nav-item">
                        <Link className="nav-link collapsed" to={"/viewer"} onClick={handleSidebarClose}>
                            <i className="bi bi-grid" />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {/* Location Data */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" data-bs-target="#location-nav" data-bs-toggle="collapse">
                            <i className="bi bi-geo-alt" />
                            <span>Locations</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul id="location-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                            <li><Link to={"/viewer/manageZone"} onClick={handleSidebarClose}><span>Manage Zones</span></Link></li>
                            <li><Link to={"/viewer/manageState"} onClick={handleSidebarClose}><span>Manage States</span></Link></li>
                            <li><Link to={"/viewer/manageCity"} onClick={handleSidebarClose}><span>Manage Cities</span></Link></li>
                            <li><Link to={"/viewer/manageStore"} onClick={handleSidebarClose}><span>Manage Stores</span></Link></li>
                        </ul>
                    </li>

                    {/* Configuration */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" data-bs-target="#config-nav" data-bs-toggle="collapse">
                            <i className="bi bi-gear" />
                            <span>Configuration</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul id="config-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                            <li><Link to={"/viewer/manageStoreCategory"} onClick={handleSidebarClose}><span>Store Categories</span></Link></li>
                            <li><Link to={"/viewer/manageExpenseHead"} onClick={handleSidebarClose}><span>Expense Heads</span></Link></li>
                            <li><Link to={"/viewer/manageApprovalPolicy"} onClick={handleSidebarClose}><span>Approval Policies</span></Link></li>
                        </ul>
                    </li>

                    {/* Users */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" data-bs-target="#employee-nav" data-bs-toggle="collapse">
                            <i className="bi bi-person-vcard" />
                            <span>Employees</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul id="employee-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                            <li><Link to={"/viewer/manageEmployee"} onClick={handleSidebarClose}><span>Manage Employees</span></Link></li>
                        </ul>
                    </li>

                    {/* Expenses */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" data-bs-target="#expense-nav" data-bs-toggle="collapse">
                            <i className="bi bi-cash-stack" />
                            <span>Expenses</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul id="expense-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                            <li><Link to={"/viewer/allApprovedExpenses"} onClick={handleSidebarClose}><i className="bi bi-check-circle" /><span>Approved</span></Link></li>
                            <li><Link to={"/viewer/allPendingExpenses"} onClick={handleSidebarClose}><i className="bi bi-hourglass-split" /><span>Pending</span></Link></li>
                            <li><Link to={"/viewer/allHoldExpenses"} onClick={handleSidebarClose}><i className="bi bi-pause-circle" /><span>Hold</span></Link></li>
                            <li><Link to={"/viewer/allRejectedExpenses"} onClick={handleSidebarClose}><i className="bi bi-x-circle" /><span>Rejected</span></Link></li>
                            <li><Link to={"/viewer/allClosedExpenses"} onClick={handleSidebarClose}><i className="bi bi-door-closed" /><span>Closed</span></Link></li>
                        </ul>
                    </li>

                </ul>
            </aside>
        </>
    );
}
