import { ScaleLoader } from "react-spinners";
import PageTitle from "../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [load, setLoad] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const downloadCSV = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/admin/export-sheet",
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expense-report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log("CSV DOWNLOAD ERROR:", err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const urlFilters = {
      date: params.get("date") || "",
      month: params.get("month") || "",
      year: params.get("year") || "",
      state: params.get("state") || "",
      zone: params.get("zone") || "",
    };

    setFilters(urlFilters);
    fetchDashboardData(urlFilters);
  }, [location.search]);

  /* ================= FILTER UI STATE ================= */
  const [filters, setFilters] = useState({
    date: "",
    month: "",
    year: "",
    state: "",
    zone: "",
  });

  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const handleResetFilters = () => {
    const resetObj = {
      date: "",
      month: "",
      year: "",
      state: "",
      zone: "",
    };

    navigate("");
  };

  /* ================= DASHBOARD DATA STATE ================= */
  const [data, setData] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    inProcessRequests: 0,
    todayRequests: 0,

    totalAmount: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    rejectedAmount: 0,
    holdAmount: 0,
    todayAmount: 0,

    totalUsers: 0,
    totalFacilityManagers: 0,
    totalCLMs: 0,
    totalZonalHeads: 0,
    totalBusinessFinance: 0,
    totalProcurement: 0,
    totalPrPo: 0,
    totalZonalCommercial: 0,
    totalMissingBridgeUsers: 0,
  });

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchDashboardData();
    fetchFilterMasters();
  }, []);

  const fetchFilterMasters = async () => {
    try {
      const [stateRes, zoneRes] = await Promise.all([
        ApiServices.GetAllState({ status: true }),
        ApiServices.GetAllZone({ status: true }),
      ]);
      setStates(stateRes?.data?.data || []);
      setZones(zoneRes?.data?.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= DASHBOARD LOGIC (UNCHANGED) ================= */
  const fetchDashboardData = async (appliedFilters = {}) => {
    setLoad(true);
    try {
      const expenseRes = await ApiServices.GetAllExpense();
      let expenses = expenseRes?.data?.data || [];

      /* ================= APPLY FILTER LOGIC ================= */

      expenses = expenses.filter((e) => {
        const createdDate = new Date(e.createdAt);

        // Date Filter
        if (
          appliedFilters.date &&
          createdDate.getDate() !== Number(appliedFilters.date)
        ) {
          return false;
        }

        // Month Filter
        if (
          appliedFilters.month &&
          createdDate.getMonth() + 1 !== Number(appliedFilters.month)
        ) {
          return false;
        }

        // Year Filter
        if (
          appliedFilters.year &&
          createdDate.getFullYear() !== Number(appliedFilters.year)
        ) {
          return false;
        }

        // State Filter
        if (
          appliedFilters.state &&
          e.storeId?.stateId !== appliedFilters.state
        ) {
          return false;
        }

        // Zone Filter
        if (appliedFilters.zone && e.storeId?.zoneId !== appliedFilters.zone) {
          return false;
        }

        return true;
      });

      /* ================= DASHBOARD CALCULATION ================= */

      const todayDate = new Date().toISOString().split("T")[0];

      const pending = expenses.filter((e) => e.currentStatus === "Pending");
      const rejected = expenses.filter((e) => e.currentStatus === "Rejected");
      const hold = expenses.filter((e) => e.currentStatus === "Hold");

      const todayExpenses = expenses.filter(
        (e) => e.createdAt?.split("T")[0] === todayDate,
      );

      const sumAmount = (arr) =>
        arr.reduce((sum, e) => sum + Number(e.amount || 0), 0);

      const approvedRes = await ApiServices.AdminExpensesByStatus({
        status: "Approved",
      });
      let approvedList = approvedRes?.data?.data || [];

      // Apply same filters to approved list
      approvedList = approvedList.filter((e) => {
        const createdDate = new Date(e.createdAt);

        if (
          appliedFilters.date &&
          createdDate.getDate() !== Number(appliedFilters.date)
        )
          return false;
        if (
          appliedFilters.month &&
          createdDate.getMonth() + 1 !== Number(appliedFilters.month)
        )
          return false;
        if (
          appliedFilters.year &&
          createdDate.getFullYear() !== Number(appliedFilters.year)
        )
          return false;
        if (appliedFilters.state && e.storeId?.stateId !== appliedFilters.state)
          return false;
        if (appliedFilters.zone && e.storeId?.zoneId !== appliedFilters.zone)
          return false;

        return true;
      });

      const roleRes = await ApiServices.Dashboard();
      const roleData = roleRes?.data?.data || {};

      setData({
        totalRequests: expenses.length,
        pendingRequests: pending.length,
        approvedRequests: approvedList.length,
        rejectedRequests: rejected.length,
        inProcessRequests: hold.length,
        todayRequests: todayExpenses.length,

        totalAmount:
          sumAmount(pending) +
          sumAmount(approvedList) +
          sumAmount(rejected) +
          sumAmount(hold),

        pendingAmount: sumAmount(pending),
        approvedAmount: sumAmount(approvedList),
        rejectedAmount: sumAmount(rejected),
        holdAmount: sumAmount(hold),
        todayAmount: sumAmount(todayExpenses),

        totalUsers: roleData.totalUsers ?? 0,
        totalFacilityManagers: roleData.totalFacilityManagers ?? 0,
        totalCLMs: roleData.totalCLMs ?? 0,
        totalZonalHeads: roleData.totalZonalHeads ?? 0,
        totalBusinessFinance: roleData.totalBusinessFinance ?? 0,
        totalProcurement: roleData.totalProcurement ?? 0,
        totalPrPo: roleData.totalPrPo ?? 0,
        totalZonalCommercial: roleData.totalZonalCommercial ?? 0,
        totalMissingBridgeUsers: roleData.totalMissingBridgeUsers ?? 0,
      });
    } finally {
      setLoad(false);
    }
  };

  /* ================= REQUEST CARDS ================= */
  const buildLink = (base) =>
    `${base}?${new URLSearchParams(filters).toString()}`;

  const requestCards = [
    {
      title: "Total Requests",
      count: data.totalRequests,
      amount: data.totalAmount,
      color: "#4B49AC",
      icon: "bi-collection",
      link: buildLink("/admin/allExpenses"),
    },
    {
      title: "Pending Requests",
      count: data.pendingRequests,
      amount: data.pendingAmount,
      color: "#FFC107",
      icon: "bi-hourglass-split",
      link: buildLink("/admin/allPendingExpenses"),
    },
    {
      title: "Approved Requests",
      count: data.approvedRequests,
      amount: data.approvedAmount,
      color: "#20C997",
      icon: "bi-check-circle",
      link: buildLink("/admin/allApprovedExpenses"),
    },
    {
      title: "Rejected Requests",
      count: data.rejectedRequests,
      amount: data.rejectedAmount,
      color: "#FF6B6B",
      icon: "bi-x-circle",
      link: buildLink("/admin/allRejectedExpenses"),
    },
    {
      title: "In-Process",
      count: data.inProcessRequests,
      amount: data.holdAmount,
      color: "#4D96FF",
      icon: "bi-arrow-repeat",
      link: buildLink("/admin/allHoldExpenses"),
    },
    {
      title: "Today’s New Requests",
      count: data.todayRequests,
      amount: data.todayAmount,
      color: "#00B8D9",
      icon: "bi-calendar-event",
      link: buildLink("/admin/todayRequests"),
    },
  ];

  const roleCards = [
    {
      title: "Total Users",
      value: data.totalUsers,
      color: "#6F42C1",
      icon: "bi-people",
      link: "/admin/manageEmployee",
    },
    {
      title: "Facility Managers",
      value: data.totalFacilityManagers,
      color: "#198754",
      icon: "bi-person-badge",
      link: "/admin/FMs",
    },
    {
      title: "CLMs",
      value: data.totalCLMs,
      color: "#FD7E14",
      icon: "bi-building",
      link: "/admin/CLMs",
    },
    {
      title: "Zonal Heads",
      value: data.totalZonalHeads,
      color: "#0D6EFD",
      icon: "bi-diagram-3",
      link: "/admin/zonalHead",
    },
    {
      title: "Business Finance",
      value: data.totalBusinessFinance,
      color: "#6610f2",
      icon: "bi-currency-rupee",
      link: "/admin/businessFinance",
    },
    {
      title: "Procurement",
      value: data.totalProcurement,
      color: "#0dcaf0",
      icon: "bi-cart-check",
      link: "/admin/procurement",
    },
    {
      title: "PR / PO",
      value: data.totalPrPo,
      color: "#adb5bd",
      icon: "bi-receipt",
      link: "/admin/prpo",
    },
    {
      title: "Zonal Commercial",
      value: data.totalZonalCommercial,
      color: "#20c997",
      icon: "bi-briefcase",
      link: "/admin/zonalCommercial",
    },
    {
      title: "Missing Bridge",
      value: data.totalMissingBridgeUsers,
      color: "#dc3545",
      icon: "bi-exclamation-octagon",
      link: "/admin/missingBridge",
    },
  ];
  const handleApplyFilters = () => {
    const query = new URLSearchParams(filters).toString();
    navigate(`?${query}`);
  };

  return (
    <main id="main" className="main">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <PageTitle child="Dashboard" />

        <button className="btn btn-success" onClick={downloadCSV}>
          <i className="bi bi-download me-2"></i>
           Expense CSV
        </button>
      </div>
      {/* ================= FILTER UI (RESTORED) ================= */}
      <div className="card mb-3">
        <div className="card-body">
          <h6 className="fw-bold mt-3">Filters</h6>
          <div className="row g-3 align-items-end">
            <div className="col-md-2">
              <label className="form-label">Date</label>
              <select
                className="form-select"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              >
                <option value="">Select Date</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Month</label>
              <select
                className="form-select"
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
              >
                <option value="">Select Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m, j) => (
                  <option key={j} value={j + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Year</label>
              <select
                className="form-select"
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
              >
                <option value="">Select Year</option>
                {Array.from({ length: 6 }, (_, i) => {
                  const y = 2023 + i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">State</label>
              <select
                className="form-select"
                value={filters.state}
                onChange={(e) => handleFilterChange("state", e.target.value)}
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.stateName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Zone</label>
              <select
                className="form-select"
                value={filters.zone}
                onChange={(e) => handleFilterChange("zone", e.target.value)}
              >
                <option value="">All Zones</option>
                {zones.map((z) => (
                  <option key={z._id} value={z._id}>
                    {z.zoneName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-12 d-flex gap-2 mt-2">
              <button className="btn btn-primary" onClick={handleApplyFilters}>
                Apply
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {load && (
        <div className="text-center mt-5">
          <ScaleLoader color="#6776f4" />
        </div>
      )}

      {!load && (
        <>
          {/* ===== REQUEST CARDS (4 PER ROW) ===== */}
          {/* ===== REQUEST CARDS ===== */}
          <div className="row g-3">
            {requestCards.map((c, i) => (
              <div key={i} className="col-6 col-md-4 col-xxl-3">
                <Link
                  to={c.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card info-card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{c.title}</h5>

                      <div className="d-flex align-items-center">
                        <div
                          className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: 50,
                            height: 50,
                            background: c.color,
                          }}
                        >
                          <i className={`bi ${c.icon} fs-4`} />
                        </div>

                        <div>
                          <h6 className="fw-bold mb-0">{c.count}</h6>
                          <small className="text-muted">
                            ₹ {c.amount.toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* ===== ROLE CARDS (5 PER ROW) ===== */}
          <h4 className="mt-4 mb-3 fw-bold" style={{ color: "#012970" }}>
            System & Role Overview
          </h4>

          <div className="row g-3">
            {roleCards.map((c, i) => (
              <div key={i} className="col-4 col-sm-4 col-md-3 col-xl-2 role-col">
                <Link
                  to={c.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card info-card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{c.title}</h5>

                      <div className="d-flex align-items-center">
                        <div
                          className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: 50,
                            height: 50,
                            background: c.color,
                          }}
                        >
                          <i className={`bi ${c.icon} fs-4`} />
                        </div>

                        <h6 className="fw-bold mb-0">{c.value}</h6>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
