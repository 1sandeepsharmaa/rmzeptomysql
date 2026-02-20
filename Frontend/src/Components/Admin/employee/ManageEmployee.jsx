import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function ManageEmployee() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // 🔹 Filter
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStoreName, setSelectedStoreName] = useState("");

  // 🔹 Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  // ================= FETCH =================
  const fetchAllStaff = async () => {
    try {
      setLoad(true);
      const responses = await Promise.all([
        ApiServices.GetAllFm(),
        ApiServices.GetAllClm(),
        ApiServices.GetAllZh(),
        ApiServices.GetAllZonalCommercial(),
        ApiServices.GetAllMissingBridge(),
        ApiServices.GetAllBf(),
        ApiServices.GetAllProcurement(),
        ApiServices.GetAllPrPo(),
      ]);

      const allData = responses.flatMap((res) =>
        res?.data?.success ? res.data.data : []
      );

      setData(allData || []);
    } catch {
      setData([]);
    }
    setTimeout(() => setLoad(false), 500);
  };

  useEffect(() => {
    fetchAllStaff();
  }, []);

  // ================= STORE EXTRACTOR =================
  const getStores = (emp) => {
    if (Array.isArray(emp.storeId)) return emp.storeId;
    if (Array.isArray(emp.storeIds)) return emp.storeIds;
    if (Array.isArray(emp.stores)) return emp.stores;
    return [];
  };

  // ================= STORE LIST =================
  const allStores = Array.from(
    new Set(
      data
        .flatMap((emp) => getStores(emp))
        .map((s) => s?.storeName)
        .filter(Boolean)
    )
  );

  // ================= YEAR LIST =================
  const years = Array.from(
    new Set(
      data
        .map((emp) => emp?.createdAt && new Date(emp.createdAt).getFullYear())
        .filter(Boolean)
    )
  ).sort((a, b) => b - a);

  // ================= FILTER =================
  useEffect(() => {
    const filtered = data
      .filter((emp) => emp.status)
      .filter((emp) => {
        const lower = searchTerm.toLowerCase();
        return (
          emp?.name?.toLowerCase().includes(lower) ||
          emp?.empcode?.toLowerCase().includes(lower)
        );
      })
      .filter((emp) => {
        if (!selectedMonth && !selectedYear) return true;
        if (!emp.createdAt) return false;

        const d = new Date(emp.createdAt);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();

        if (selectedMonth && selectedYear)
          return m === Number(selectedMonth) && y === Number(selectedYear);
        if (selectedMonth) return m === Number(selectedMonth);
        if (selectedYear) return y === Number(selectedYear);
        return true;
      })
      .filter((emp) => {
        if (!selectedStoreName) return true;
        return getStores(emp).some(
          (s) => s.storeName === selectedStoreName
        );
      });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    data,
    selectedMonth,
    selectedYear,
    selectedStoreName,
  ]);

  const currentEmployees = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= CSV =================
  const csvData = filteredData.map((emp, idx) => ({
    srNo: idx + 1,
    empcode: emp.empcode,
    name: emp.name,
    email: emp.email,
    contact: emp.contact,
    stores: getStores(emp).map((s) => s.storeName).join(", "),
    designation: emp.designation,
  }));

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Manage Employee" />

        {/* 🔍 SEARCH + ACTION BAR */}
        <div className="container-fluid mb-3 position-relative">
          <div className="row">
            <div className="col-12 d-flex align-items-center gap-3">
              {/* Search */}
              <input
                className="form-control"
                style={{ maxWidth: "420px" }}
                placeholder="Search by Name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* RIGHT ACTIONS (FIXED) */}
              <div className="ms-auto d-flex gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <i className="bi bi-funnel"></i> Filter
                </button>

                <CSVLink
                  data={csvData}
                  className="btn btn-primary btn-sm"
                >
                  Download CSV
                </CSVLink>
              </div>
            </div>
          </div>

          {/* 🔽 FILTER PANEL */}
          {showFilter && (
            <div
              className="card p-3 shadow position-absolute"
              style={{ right: "0", top: "45px", zIndex: 10, width: "340px" }}
            >
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label mb-1">Month</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">All</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label mb-1">Year</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">All</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label mb-1">Store</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedStoreName}
                    onChange={(e) => setSelectedStoreName(e.target.value)}
                  >
                    <option value="">All Stores</option>
                    {allStores.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 d-flex justify-content-between mt-2">
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => {
                      setSelectedMonth("");
                      setSelectedYear("");
                      setSelectedStoreName("");
                      setShowFilter(false);
                    }}
                  >
                    Clear
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowFilter(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="container-fluid">
          <ScaleLoader
            color="#6776f4"
            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
            loading={load}
          />

          {!load && (
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Sr. No</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Store</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.length ? (
                  currentEmployees.map((el, idx) => (
                    <tr key={el._id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>{el.empcode}</td>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.contact}</td>
                      <td>
                        <span
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() => {
                            setModalTitle(`${el.name} - Stores`);
                            setModalContent(getStores(el));
                            setModalOpen(true);
                          }}
                        >
                          View Stores
                        </span>
                      </td>
                      <td>{el.designation}</td>
                      <td>{el.status ? "Active" : "Inactive"}</td>
                      <td>
                        <Link
                          to={`/admin/editEmployee/${el._id}`}
                          state={{ designation: el.designation }}
                          className="btn btn-primary btn-sm"
                        >
                          <i className="bi bi-pen"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">
                      No Active Employee Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={() => setModalOpen(false)}
            ></button>
            <h5>{modalTitle}</h5>
            <ul>
              {modalContent.length ? (
                modalContent.map((s, i) => (
                  <li key={i}>{s.storeName || "Unnamed Store"}</li>
                ))
              ) : (
                <li className="text-muted">No Stores Assigned</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
