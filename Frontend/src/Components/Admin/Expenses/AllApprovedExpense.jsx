import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ExpenseTimeline from "../../common/ExpenseTimeline";
import { useLocation } from "react-router-dom";

export default function AllApprovedExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);

  const [totalApprovedAmount, setTotalApprovedAmount] = useState(0);

  /* 🔍 Search */
  const [searchTerm, setSearchTerm] = useState("");

  /* 📄 Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const appliedFilters = {
    date: queryParams.get("date"),
    month: queryParams.get("month"),
    year: queryParams.get("year"),
    state: queryParams.get("state"),
    zone: queryParams.get("zone"),
  };
  /* ================= FETCH APPROVED ================= */
  const fetchApproved = () => {
    setLoad(true);

    ApiServices.AdminExpensesByStatus({ status: "Approved" })
      .then((res) => {
        if (res?.data?.success) {

          const list = res.data.data || [];

          /* 🔥 APPLY SAME FILTER LOGIC */
          const filteredList = list.filter((e) => {
            const createdDate = new Date(e.createdAt);

            if (appliedFilters.date &&
              createdDate.getDate() !== Number(appliedFilters.date))
              return false;

            if (appliedFilters.month &&
              createdDate.getMonth() + 1 !== Number(appliedFilters.month))
              return false;

            if (appliedFilters.year &&
              createdDate.getFullYear() !== Number(appliedFilters.year))
              return false;

            if (appliedFilters.state &&
              e.storeId?.stateId !== appliedFilters.state)
              return false;

            if (appliedFilters.zone &&
              e.storeId?.zoneId !== appliedFilters.zone)
              return false;

            return true;
          });

          setData(filteredList);

          const total = filteredList.reduce(
            (sum, e) => sum + Number(e.amount || 0),
            0
          );

          setTotalApprovedAmount(total);

        } else {
          setData([]);
          setTotalApprovedAmount(0);
        }
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load approved expenses", "error");
      })
      .finally(() => setLoad(false));
  };


  useEffect(() => {
    fetchApproved();
  }, []);

  const sortedData = [...data].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  /* ================= SEARCH FILTER ================= */
  const filteredData = sortedData.filter(
    (e) =>
      e.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.storeId?.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.expenseHeadId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ================= CSV DATA ================= */
  const csvData = filteredData.map((e, index) => ({
    SrNo: index + 1,
    TicketID: e.ticketId,
    Store: e.storeId?.storeName,
    ExpenseHead: e.expenseHeadId?.name,
    Amount: e.amount,
    ApprovedBy: e.actionBy,
    ApprovedOn: e.actionAt
      ? new Date(e.actionAt).toLocaleDateString()
      : "-",
  }));

  /* ================= MODAL ================= */
  const handleView = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);

    ApiServices.ExpenseHistory({ expenseId: expense._id })
      .then((res) => {
        setApprovalHistory(res?.data?.data || []);
      })
      .catch(() => {
        setApprovalHistory([]);
      });
  };

  const handleClose = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Approved Expenses (Admin)" />

      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      {!load && (
        <>
          {/* 🔥 TOTAL */}
          <div className="container-fluid mt-3">
            <h6 className="fw-bold text-success">
              Total Approved Amount : ₹{" "}
              {totalApprovedAmount.toLocaleString()}
            </h6>
          </div>

          {/* 🔍 SEARCH + CSV */}
          <div className="container-fluid mt-2">
            <div className="row align-items-center mb-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Search by Ticket ID, Store, Expense Head"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="col-md-6 text-end">
                <CSVLink
                  data={csvData}
                  filename="Admin_Approved_Expenses.csv"
                  className="btn btn-primary btn-sm"
                >
                  Download CSV
                </CSVLink>
              </div>
            </div>
          </div>

          {/* 📋 TABLE */}
          <div className="container-fluid">
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Sr No</th>
                    <th>Created At</th>
                    <th>Ticket ID</th>
                    <th>Store</th>
                    <th>Expense Head</th>
                    <th>Amount</th>
                    <th>Approved Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((e, index) => (
                      <tr key={e._id}>
                        <td>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td>
                            {e.createdAt
                              ? new Date(e.createdAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                              : "-"}
                          </td>
                        <td>{e.ticketId}</td>
                        <td>{e.storeId?.storeName || "-"}</td>
                        <td>{e.expenseHeadId?.name || "-"}</td>
                        <td>₹ {e.amount}</td>
                        <td>
                          {e.updatedAt
                            ? new Date(e.updatedAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <span className="badge bg-success">
                            Approved
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleView(e)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No Approved Expenses Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 📄 PAGINATION */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-secondary me-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn me-1 ${currentPage === i + 1
                      ? "btn-primary"
                      : "btn-light"
                      }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="btn btn-secondary ms-2"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* 🔥 MODAL SAME AS BEFORE */}
      {showModal && selectedExpense && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Expense Details</h5>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-close"
                />
              </div>

              <div className="modal-body px-4">
                <div className="p-4 mb-4 rounded shadow-sm bg-light border">
<div className="row g-3">

                    <div className="col-md-6">
                      <div className="text-muted small">Ticket ID</div>
                      <div className="fw-semibold">{selectedExpense.ticketId}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Store</div>
                      <div className="fw-semibold">
                        {selectedExpense.storeId?.storeName}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Expense Head</div>
                      <div className="fw-semibold">
                        {selectedExpense.expenseHeadId?.name}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Amount</div>
                      <div className="fw-semibold text-success">
                        ₹ {selectedExpense.amount}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Policy</div>
                      <div className="fw-semibold">
                        {selectedExpense.policy || "-"}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Nature of Expense</div>
                      <div className="fw-semibold">
                        {selectedExpense.natureOfExpense}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">RCA</div>
                      <div>{selectedExpense.rca || "-"}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Remarks</div>
                      <div>{selectedExpense.remark || "-"}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Status</div>
                      <span className="badge bg-success px-3 py-2">
                        Approved
                      </span>
                    </div>

                  </div>
                  {/* SAME DETAILS */}

                  <ExpenseTimeline
                    expense={selectedExpense}
                    approvalHistory={approvalHistory}
                  />

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}
