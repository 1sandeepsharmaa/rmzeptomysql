import { ScaleLoader } from "react-spinners";
import PageTitle from "../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

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
      status: params.get("status") || "",
      currentApprovalLevel: params.get("currentApprovalLevel") || params.get("level") || "",
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
    status: "",
    currentApprovalLevel: "",
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
      status: "",
      currentApprovalLevel: "",
    };

    navigate("");
  };

  /* ================= DASHBOARD DATA STATE ================= */
  const [data, setData] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    closedRequests: 0,
    rejectedRequests: 0,
    inProcessRequests: 0,
    todayRequests: 0,

    totalAmount: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    closedAmount: 0,
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

  const [trendData, setTrendData] = useState({ labels: [], datasets: [] });
  const [zoneCostData, setZoneCostData] = useState({ labels: [], datasets: [] });
  const [statusDistData, setStatusDistData] = useState({
    labels: [],
    datasets: [],
  });
  const [monthlyCostData, setMonthlyCostData] = useState({
    labels: [],
    datasets: [],
  });
  const [dailyCostData, setDailyCostData] = useState({
    labels: [],
    datasets: [],
  });
  const [approverWorkload, setApproverWorkload] = useState({});

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
          String(e.storeId?.stateId) !== String(appliedFilters.state)
        ) {
          return false;
        }

        // Zone Filter
        if (
          appliedFilters.zone &&
          String(e.storeId?.zoneId) !== String(appliedFilters.zone)
        ) {
          return false;
        }

        // Status Filter (Cross-Filtering)
        if (
          appliedFilters.status &&
          e.currentStatus !== appliedFilters.status
        ) {
          return false;
        }

        // Approval Level Filter
        if (
          appliedFilters.currentApprovalLevel &&
          e.currentApprovalLevel !== appliedFilters.currentApprovalLevel
        ) {
          return false;
        }

        return true;
      });

      /* ================= DASHBOARD CALCULATION ================= */

      const todayDate = new Date().toISOString().split("T")[0];

      const pending = expenses.filter((e) => e.currentStatus === "Pending");
      const approved = expenses.filter((e) => e.currentStatus === "Approved");
      const rejected = expenses.filter((e) => e.currentStatus === "Rejected");
      const hold = expenses.filter((e) => e.currentStatus === "Hold");
      const closed = expenses.filter((e) => e.currentStatus === "Closed");

      const todayExpenses = expenses.filter(
        (e) => e.createdAt?.split("T")[0] === todayDate,
      );

      const sumAmount = (arr) =>
        arr.reduce((sum, e) => sum + Number(e.amount || 0), 0);

      const roleRes = await ApiServices.Dashboard();
      const roleData = roleRes?.data?.data || {};

      setData({
        totalRequests: expenses.length,
        pendingRequests: pending.length,
        approvedRequests: approved.length,
        closedRequests: closed.length,
        rejectedRequests: rejected.length,
        inProcessRequests: hold.length,
        todayRequests: todayExpenses.length,

        totalAmount:
          sumAmount(pending) +
          sumAmount(approved) +
          sumAmount(rejected) +
          sumAmount(hold) +
          sumAmount(closed),

        pendingAmount: sumAmount(pending),
        approvedAmount: sumAmount(approved),
        closedAmount: sumAmount(closed),
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

      /* ================= ANALYTICS CALCULATIONS ================= */

      // 1. Raised vs Approved Trend (Last 7 Days)
      const last7Days = [...Array(7)]
        .map((_, i) => moment().subtract(i, "days").format("YYYY-MM-DD"))
        .reverse();

      const raisedTrend = last7Days.map(
        (date) =>
          expenses.filter((e) => e.createdAt?.split("T")[0] === date).length
      );
      const approvedTrend = last7Days.map(
        (date) =>
          expenses.filter(
            (e) =>
              (e.currentStatus === "Approved" || e.currentStatus === "Closed") &&
              e.updatedAt?.split("T")[0] === date
          ).length
      );

      setTrendData({
        labels: last7Days.map((d) => moment(d).format("DD MMM")),
        datasets: [
          {
            label: "Expenses Raised",
            data: raisedTrend,
            borderColor: "#4B49AC",
            backgroundColor: "rgba(75, 73, 172, 0.2)",
            tension: 0.4,
            fill: true
          },
          {
            label: "Expenses Approved",
            data: approvedTrend,
            borderColor: "#20C997",
            backgroundColor: "rgba(32, 201, 151, 0.2)",
            tension: 0.4,
            fill: true
          },
        ],
      });

      // 2. Zone-wise Cost Analysis
      const zoneMap = {};
      expenses.forEach((e) => {
        const zoneName = e.storeId?.zoneData?.zoneName || "Unknown";
        zoneMap[zoneName] = (zoneMap[zoneName] || 0) + Number(e.amount || 0);
      });

      setZoneCostData({
        labels: Object.keys(zoneMap),
        datasets: [
          {
            label: "Cost by Zone",
            data: Object.values(zoneMap),
            backgroundColor: [
              "#4B49AC",
              "#FFC107",
              "#20C997",
              "#FF6B6B",
              "#4D96FF",
              "#00B8D9",
            ],
          },
        ],
      });

      // 3. Approver Workload Analysis
      const workloadMap = {};
      pending.forEach((e) => {
        const level = e.currentApprovalLevel || "Pending Submission";
        workloadMap[level] = (workloadMap[level] || 0) + 1;
      });
      setApproverWorkload(workloadMap);

      // 4. Status Distribution
      const statusCounts = {
        Pending: pending.length,
        Approved: approved.length,
        Hold: hold.length,
        Rejected: rejected.length,
        Closed: closed.length,
      };

      setStatusDistData({
        labels: Object.keys(statusCounts),
        datasets: [
          {
            label: "No. of Requests",
            data: Object.values(statusCounts),
            backgroundColor: [
              "#FFC107",
              "#20C997",
              "#4D96FF",
              "#FF6B6B",
              "#0D6EFD",
            ],
          },
        ],
      });

      // 5. Monthly Cost (Current Year)
      const months = moment.monthsShort();
      const monthCosts = months.map((m, i) => {
        return expenses
          .filter((e) => moment(e.createdAt).month() === i)
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      });

      setMonthlyCostData({
        labels: months,
        datasets: [
          {
            label: "Monthly Expenditure (₹)",
            data: monthCosts,
            backgroundColor: "#4B49AC",
            borderRadius: 5
          },
        ],
      });

      // 6. Daily Cost (Last 14 Days)
      const last14Days = [...Array(14)]
        .map((_, i) => moment().subtract(i, "days").format("YYYY-MM-DD"))
        .reverse();

      const dailyCosts = last14Days.map((date) => {
        return expenses
          .filter((e) => e.createdAt?.split("T")[0] === date)
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      });

      setDailyCostData({
        labels: last14Days.map((d) => moment(d).format("DD MMM")),
        datasets: [
          {
            label: "Daily Expenditure (₹)",
            data: dailyCosts,
            borderColor: "#FFC107",
            backgroundColor: "rgba(255, 193, 7, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      });
    } finally {
      setLoad(false);
    }
  };

  /* ================= INTERACTIVITY: CHART CLICK HANDLER ================= */
  const onChartClick = (event, elements, chartInstance, type) => {
    if (!elements.length) return;
    const { index } = elements[0];
    const label = chartInstance.data.labels[index];

    const newFilters = { ...filters };

    switch (type) {
      case "STATUS":
        newFilters.status = label;
        break;
      case "ZONE":
        const zoneObj = zones.find((z) => z.zoneName === label);
        if (zoneObj) newFilters.zone = zoneObj._id;
        break;
      case "MONTH":
        const monthIdx = moment.monthsShort().indexOf(label) + 1;
        if (monthIdx > 0) newFilters.month = monthIdx;
        break;
      case "TREND":
      case "DAILY":
        // Label is like "23 Feb"
        const day = parseInt(label.split(" ")[0]);
        if (!isNaN(day)) newFilters.date = day;
        break;
      default:
        break;
    }

    const query = new URLSearchParams(newFilters).toString();
    navigate(`?${query}`);
  };

  /* ================= REQUEST CARDS ================= */
  const buildLink = (base) => {
    const params = new URLSearchParams();
    if (filters.date) params.append("date", filters.date);
    if (filters.month) params.append("month", filters.month);
    if (filters.year) params.append("year", filters.year);
    if (filters.state) params.append("state", filters.state);
    if (filters.zone) params.append("zone", filters.zone);
    if (filters.status) params.append("status", filters.status);
    if (filters.currentApprovalLevel) params.append("currentApprovalLevel", filters.currentApprovalLevel);

    const query = params.toString();
    return query ? `${base}?${query}` : base;
  };

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
      title: "Closed Requests",
      count: data.closedRequests,
      amount: data.closedAmount,
      color: "#0D6EFD",
      icon: "bi-check-all",
      link: buildLink("/admin/allClosedExpenses"),
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

            <div className="col-md-2">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                {["Pending", "Approved", "Hold", "Rejected", "Closed"].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ),
                )}
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
                          <h6 className="fw-bold mb-0">{c.count ?? 0}</h6>
                          <small className="text-muted">
                            ₹ {(c.amount ?? 0).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* ===== ANALYTICS SECTION ===== */}
          <h4 className="mt-5 mb-3 fw-bold" style={{ color: "#012970" }}>
            <i className="bi bi-graph-up me-2"></i>Advanced Geographical & Trend Analytics
          </h4>

          <div className="row g-4 mb-4">
            {/* Trend Chart */}
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title">Expense Trend (Raised vs Approved)</h5>
                  <div style={{ height: "300px" }}>
                    <Line
                      data={trendData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { position: "bottom" } },
                        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                        onClick: (e, el, chart) => onChartClick(e, el, chart, "TREND"),
                        cursor: "pointer"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Dist */}
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title">Status Distribution</h5>
                  <div style={{ height: "300px" }}>
                    <Doughnut
                      data={statusDistData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { position: "bottom" } },
                        onClick: (e, el, chart) => onChartClick(e, el, chart, "STATUS"),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Monthly Cost */}
            <div className="col-lg-7">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title">Monthly Expenditure Analysis</h5>
                  <div style={{ height: "300px" }}>
                    <Bar
                      data={monthlyCostData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } },
                        onClick: (e, el, chart) => onChartClick(e, el, chart, "MONTH"),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Cost */}
            <div className="col-lg-12">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title">Daily Expenditure Trend (Last 14 Days)</h5>
                  <div style={{ height: "300px" }}>
                    <Line
                      data={dailyCostData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } },
                        onClick: (e, el, chart) => onChartClick(e, el, chart, "DAILY"),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Zone Cost */}
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title">Zone-wise Cost Analysis (₹)</h5>
                  <div style={{ height: "300px" }}>
                    <Bar
                      data={zoneCostData}
                      options={{
                        indexAxis: "y",
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        onClick: (e, el, chart) => onChartClick(e, el, chart, "ZONE"),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== APPROVER WORKLOAD SECTION ===== */}
          <div className="row g-4 mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title">Pending on Approver (Workload Analysis)</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light text-secondary">
                        <tr>
                          <th>Approval Level / Designation</th>
                          <th className="text-center">Pending Count</th>
                          <th>Indicator</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(approverWorkload).length > 0 ? (
                          Object.entries(approverWorkload).map(([level, count], idx) => (
                            <tr
                              key={idx}
                              onClick={() => {
                                const newFilters = { ...filters, currentApprovalLevel: level };
                                const query = new URLSearchParams(newFilters).toString();
                                navigate(`?${query}`);
                              }}
                              style={{ cursor: "pointer" }}
                              className={filters.currentApprovalLevel === level ? "table-primary" : ""}
                            >
                              <td><span className="fw-semibold">{level}</span></td>
                              <td className="text-center">
                                <span className="badge bg-warning text-dark fs-6 rounded-pill px-3">
                                  {count}
                                </span>
                              </td>
                              <td>
                                <div className="progress" style={{ height: "8px" }}>
                                  <div
                                    className="progress-bar bg-warning"
                                    role="progressbar"
                                    style={{ width: `${Math.min((count / data.pendingRequests) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center text-muted py-3">
                              No Pending Approvals
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== ROLE CARDS (5 PER ROW) ===== */}
          <h4 className="mt-4 mb-3 fw-bold" style={{ color: "#012970" }}>
            <i className="bi bi-person-lines-fill me-2"></i>System & Role Overview
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
