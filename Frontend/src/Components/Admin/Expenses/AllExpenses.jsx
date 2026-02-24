import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { CSVLink } from "react-csv";
import ExpenseTimeline from "../../common/ExpenseTimeline";

export default function AllExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [load, setLoad] = useState(false);
  const isViewer = sessionStorage.getItem("userType") === "11";
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);

  const itemsPerPage = 20;

  const [amounts, setAmounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    hold: 0,
    closed: 0,
  });

  /* ================= LOCATION FILTER ================= */
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const appliedFilters = {
    date: queryParams.get("date"),
    month: queryParams.get("month"),
    year: queryParams.get("year"),
    state: queryParams.get("state"),
    zone: queryParams.get("zone"),
    status: queryParams.get("status"),
    currentApprovalLevel: queryParams.get("currentApprovalLevel"),
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchExpenses();
  }, [location.search]);

  const fetchExpenses = async () => {
    setLoad(true);
    try {
      const res = await ApiServices.GetAllExpense();
      let allExpenses = res?.data?.data || [];

      /* ================= APPLY FILTER ================= */
      allExpenses = allExpenses.filter((e) => {
        const createdDate = new Date(e.createdAt);

        if (appliedFilters.date &&
          createdDate.getDate() !== Number(appliedFilters.date)) return false;

        if (appliedFilters.month &&
          createdDate.getMonth() + 1 !== Number(appliedFilters.month)) return false;

        if (appliedFilters.year &&
          createdDate.getFullYear() !== Number(appliedFilters.year)) return false;

        if (appliedFilters.state &&
          e.storeId?.stateId?.toString() !== appliedFilters.state) return false;

        if (appliedFilters.zone &&
          e.storeId?.zoneId?.toString() !== appliedFilters.zone) return false;

        if (appliedFilters.status &&
          e.currentStatus !== appliedFilters.status) return false;

        if (appliedFilters.currentApprovalLevel &&
          e.currentApprovalLevel !== appliedFilters.currentApprovalLevel) return false;

        return true;
      });

      const sum = (arr) =>
        arr.reduce((t, e) => t + Number(e.amount || 0), 0);

      const pending = allExpenses.filter(e => e.currentStatus === "Pending");
      const approved = allExpenses.filter(e => e.currentStatus === "Approved");
      const rejected = allExpenses.filter(e => e.currentStatus === "Rejected");
      const hold = allExpenses.filter(e => e.currentStatus === "Hold");
      const closed = allExpenses.filter(e => e.currentStatus === "Closed");

      setExpenses(allExpenses);

      setAmounts({
        total: sum(allExpenses),
        pending: sum(pending),
        approved: sum(approved),
        rejected: sum(rejected),
        hold: sum(hold),
        closed: sum(closed),
      });


    } finally {
      setLoad(false);
    }
  };

  /* ================= SEARCH ================= */
  const filteredData = expenses.filter((e) =>
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

  /* ================= CSV ================= */
  const csvData = filteredData.map((e, index) => ({
    SrNo: index + 1,
    TicketID: e.ticketId,
    Store: e.storeId?.storeName,
    ExpenseHead: e.expenseHeadId?.name,
    Amount: e.amount,
    Nature: e.natureOfExpense,
    Status: e.currentStatus,
    RejectionComment: e.rejectionComment || "-",
    RejectedOn: e.rejectedOn ? new Date(e.rejectedOn).toLocaleDateString() : "-",
  }));
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
      <PageTitle child="All Requests" />

      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      {!load && (
        <div className="container-fluid mt-3">

          {/* 🔥 TOTAL SECTION SAME STYLE */}
          <div className="mb-3">
            <h6 className="fw-bold text-primary">
              Total Amount : ₹ {amounts.total.toLocaleString()}
            </h6>
            <h6 className="fw-bold">
              Pending :
              <span className="ms-2 text-warning">
                ₹ {amounts.pending.toLocaleString()}
              </span>
              {" | "}
              Approved :
              <span className="ms-2 text-success">
                ₹ {amounts.approved.toLocaleString()}
              </span>
              {" | "}
              Rejected :
              <span className="ms-2 text-danger">
                ₹ {amounts.rejected.toLocaleString()}
              </span>
              {" | "}
              Hold :
              <span className="ms-2 text-primary">
                ₹ {amounts.hold.toLocaleString()}
              </span>
              {" | "}
              Closed :
              <span className="ms-2 text-dark">
                ₹ {amounts.closed.toLocaleString()}
              </span>

            </h6>
          </div>

          {/* 🔍 SEARCH + CSV */}
          <div className="row mb-3">
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
                filename="All_Expenses.csv"
                className="btn btn-primary btn-sm"
              >
                Download CSV
              </CSVLink>
            </div>
          </div>

          {/* 📋 TABLE */}
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Sr No</th>
                  <th>Created At</th>
                  <th>Ticket ID</th>
                  <th>Store</th>
                  <th>Expense Head</th>
                  <th>Nature</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Rejection Comment</th>
                  <th>Rejected On</th>
                  {!isViewer && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {currentData.length ? (
                  currentData.map((e, index) => (
                    <tr key={e._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                      <td>{e.storeId?.storeName}</td>
                      <td>{e.expenseHeadId?.name}</td>
                      <td>
                        <span className={`badge ${e.natureOfExpense === 'CAPEX' ? 'bg-info' : 'bg-secondary'}`}>
                          {e.natureOfExpense}
                        </span>
                      </td>
                      <td>₹ {Number(e.amount).toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge ${e.currentStatus === "Pending"
                            ? "bg-warning text-dark"
                            : e.currentStatus === "Approved"
                              ? "bg-success"
                              : e.currentStatus === "Hold"
                                ? "bg-primary"
                                : e.currentStatus === "Closed"
                                  ? "bg-secondary"
                                  : "bg-danger"
                            }`}

                        >
                          {e.currentStatus}
                        </span>
                      </td>
                      <td>{e.rejectionComment || "-"}</td>
                      <td>
                        {e.rejectedOn
                          ? new Date(e.rejectedOn).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })
                          : "-"}
                      </td>
                      {!isViewer && (
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleView(e)}
                          >
                            View
                          </button>
                        </td>
                      )}

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={!isViewer ? 11 : 10} className="text-center text-muted">
                      No Requests Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn me-1 ${currentPage === i + 1 ? "btn-primary" : "btn-light"
                      }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "red",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body px-4">

                <div className="p-4 mb-4 rounded shadow-sm bg-light border">
                  <div className="row g-3">

                    <div className="col-md-6">
                      <div className="text-muted small">Ticket ID</div>
                      <div className="fw-semibold">
                        {selectedExpense.ticketId}
                      </div>
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
                        ₹ {Number(selectedExpense.amount).toLocaleString()}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Nature of Expense</div>
                      <div className="fw-semibold">
                        <span className={`badge ${selectedExpense.natureOfExpense === 'CAPEX' ? 'bg-info' : 'bg-secondary'}`}>
                          {selectedExpense.natureOfExpense}
                        </span>
                      </div>
                    </div>

                    {selectedExpense.currentStatus === "Closed" && (
                      <div className="col-md-6">
                        <div className="text-muted small">Prism ID</div>
                        <div className="fw-semibold">
                          {selectedExpense.prismId || "-"}
                        </div>
                      </div>
                    )}

                    <div className="col-md-6">
                      <div className="text-muted small">Status</div>
                      <span className={`badge ${selectedExpense.currentStatus === "Pending"
                        ? "bg-warning text-dark"
                        : selectedExpense.currentStatus === "Approved"
                          ? "bg-success"
                          : selectedExpense.currentStatus === "Hold"
                            ? "bg-primary"
                            : selectedExpense.currentStatus === "Closed"
                              ? "bg-dark"
                              : "bg-danger"
                        }`}>
                        {selectedExpense.currentStatus}
                      </span>
                    </div>
                    {selectedExpense.currentStatus === "Closed" && (
                      <div className="col-md-6">
                        <div className="text-muted small">Closed On</div>
                        <div>
                          {selectedExpense.actionAt
                            ? new Date(selectedExpense.actionAt).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                    )}

                    <div className="col-md-6">
                      <div className="text-muted small">Created On</div>
                      <div>
                        {new Date(selectedExpense.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {selectedExpense.currentStatus === "Rejected" && (
                      <>
                        <div className="col-md-6">
                          <div className="text-muted small">Rejection Comment</div>
                          <div className="text-danger fw-semibold">
                            {selectedExpense.rejectionComment || "-"}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-muted small">Rejected On</div>
                          <div>
                            {selectedExpense.rejectedOn ? new Date(selectedExpense.rejectedOn).toLocaleString() : "-"}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Attachments */}
                    <div className="col-12">
                      <div className="text-muted small mb-1">Attachments</div>

                      {selectedExpense.attachment && (
                        <a
                          href={selectedExpense.attachment}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-primary me-2"
                        >
                          Original
                        </a>
                      )}

                      {selectedExpense.resubmittedAttachment && (
                        <a
                          href={selectedExpense.resubmittedAttachment}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-success"
                        >
                          Resubmitted
                        </a>
                      )}

                      {!selectedExpense.attachment &&
                        !selectedExpense.resubmittedAttachment && (
                          <span className="text-muted">
                            No Attachment
                          </span>
                        )}
                    </div>

                  </div>

                  {/* 🔥 TIMELINE */}
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
