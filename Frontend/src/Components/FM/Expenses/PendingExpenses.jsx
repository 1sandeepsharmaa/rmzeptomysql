import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ExpenseTimeline from "../../common/ExpenseTimeline";

export default function PendingExpense() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  /* ================= FETCH PENDING EXPENSE ================= */
  useEffect(() => {
    setLoad(true);
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }
    ApiServices.MyExpenses({
      userId,
      // currentApprovalLevel: "FM",
      currentStatus: "Pending"
    })
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
      })
      .finally(() => setLoad(false));
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredData = data.filter((el) =>
    el.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    el.storeId?.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    el.expenseHeadId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  /* ================= CSV DATA ================= */
  const csvData = filteredData.map((el, index) => ({
    SrNo: index + 1,
    TicketID: el.ticketId,
    Store: el.storeId?.storeName,
    ExpenseHead: el.expenseHeadId?.name,
    Amount: el.amount,
    Policy: el.policy || "-",
    Status: "Pending",
    CreatedAt: new Date(el.createdAt).toLocaleDateString(),
  }));

  /* ================= MODAL HANDLERS ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    console.log("EXPENSE OBJECT:", expense);
    setShowModal(true);

    ApiServices.ExpenseHistory({ expenseId: expense._id })
      .then((res) => {
        setApprovalHistory(res?.data?.data || []);
      })
      .catch(() => {
        setApprovalHistory([]);
      });
  };


  const handleCloseModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  // ================= PAGINATION LOGIC =================
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const showPagination = data.length > itemsPerPage;
  const currentExpenses = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <main className="main" id="main">
      <PageTitle child="Pending Expenses" />

      {/* Loader */}
      <div className="container-fluid">
        <ScaleLoader
          color="#6776f4"
          cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          loading={load}
        />
      </div>

      {/* Search + CSV */}
      {!load && (
        <div className="container-fluid mb-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by Ticket ID, Store or Expense Head"
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
                filename="Pending_Expenses.csv"
                className="btn btn-primary btn-sm"
              >
                Download CSV
              </CSVLink>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!load && (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12 mt-4 table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Sr. No</th>
                    <th>Ticket ID</th>
                    <th>Store</th>
                    <th>Expense Head</th>
                    <th>Amount</th>
                    <th>Policy</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentExpenses.length ? (
                    currentExpenses.map((el, index) => (
                      <tr key={el._id}>
                        <td>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td>{el.ticketId}</td>
                        <td>{el.storeId?.storeName}</td>
                        <td>{el.expenseHeadId?.name}</td>
                        <td>₹ {el.amount}</td>
                        <td>{el.policy || "-"}</td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            Pending
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleViewClick(el)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No Pending Expenses Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {showPagination && (
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
                  className={`btn me-1 ${currentPage === i + 1 ? "btn-primary" : "btn-light"
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
      )}

      {/* Modal */}
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
                  onClick={handleCloseModal}
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "red",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                      <div className="fw-semibold">{selectedExpense.ticketId}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Store:</div>
                      <div className="fw-semibold">{selectedExpense.storeId?.storeName}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Expense Head:</div>
                      <div className="fw-semibold">{selectedExpense.expenseHeadId?.name}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Amount:</div>
                      <div className="fw-semibold">₹ {selectedExpense.amount}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Policy:</div>
                      <div className="fw-semibold">{selectedExpense.policy || "-"}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Nature of Expense:</div>
                      <div className="fw-semibold">{selectedExpense.natureOfExpense || "-"}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">RCA:</div>
                      <div className="fw-semibold">{selectedExpense.rca || "-"}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Remarks:</div>
                      <div className="fw-semibold">{selectedExpense.remark || "-"}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Status</div>
                      <span className="badge bg-warning text-dark px-3 py-2">
                        Pending
                      </span>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Created At:</div>
                      <div className="fw-semibold">
                        {new Date(
                          selectedExpense.createdAt
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    {/* <div className="col-12 mt-3">
                      <div className="text-muted small mb-2">Attachments</div>

                      {selectedExpense.attachment && (
                        <a
                          href={selectedExpense.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary me-2"
                        >
                          Original
                        </a>
                      )}

                      {selectedExpense.resubmittedAttachment && (
                        <a
                          href={selectedExpense.resubmittedAttachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-success"
                        >
                          Resubmitted
                        </a>
                      )}

                      {!selectedExpense.attachment &&
                        !selectedExpense.resubmittedAttachment && (
                          <div className="text-muted">No Attachment</div>
                        )}
                    </div> */}

                    {/* 🔥 FIXED ATTACHMENT LOGIC (UI SAME) */}
                    <ExpenseTimeline
                      expense={selectedExpense}
                      approvalHistory={approvalHistory}
                    />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
