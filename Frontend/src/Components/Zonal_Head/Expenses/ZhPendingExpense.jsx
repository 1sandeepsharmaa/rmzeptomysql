import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { CSVLink } from "react-csv";
import ExpenseTimeline from "../../common/ExpenseTimeline";

export default function ZhPendingExpense() {
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

  const userId = sessionStorage.getItem("userId");

  /* ================= FETCH PENDING ================= */
  const fetchPending = () => {
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    setLoad(true);

    ApiServices.GetZhPendingExpenses({ userId })
      .then((res) => {
        setData(res?.data?.success ? res.data.data || [] : []);
      })
      .finally(() => setLoad(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredData = data.filter(
    (el) =>
      el.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.storeId?.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.expenseHeadId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentExpenses = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ================= CSV DATA ================= */
  const csvData = filteredData.map((el, index) => ({
    SrNo: index + 1,
    TicketID: el.ticketId,
    Store: el.storeId?.storeName,
    ExpenseHead: el.expenseHeadId?.name,
    Amount: el.amount,
    Status: "Pending",
  }));

  /* ================= ACTION HANDLER ================= */
  const takeAction = (type, expenseId) => {
    Swal.fire({
      title: `Confirm ${type}`,
      input: "textarea",
      inputPlaceholder: "Enter comment...",
      showCancelButton: true,
      confirmButtonText: type,
      cancelButtonText: "Cancel",

      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Required";
        }
      },

      didOpen: () => {
        const textarea = Swal.getInput();

        textarea.style.transition = "0.2s ease";

        textarea.addEventListener("input", () => {
          if (textarea.value.trim()) {
            textarea.style.border = "1px solid #ced4da";
          }
        });
      },

      preConfirm: (value) => {
        if (!value || !value.trim()) {
          const textarea = Swal.getInput();
          textarea.style.border = "2px solid red";
          return false;
        }
        return value;
      }

    }).then((result) => {
      if (!result.isConfirmed) return;

      const payload = {
        expenseId,
        approverId: userId,
        comment: result.value.trim(),
      };

      setLoad(true);

      let apiCall;
      if (type === "Approve") apiCall = ApiServices.ApproveExpense;
      if (type === "Hold") apiCall = ApiServices.HoldExpense;
      if (type === "Reject") apiCall = ApiServices.RejectExpense;

      apiCall(payload)
        .then((res) => {
          setLoad(false);
          if (res?.data?.success) {
            Swal.fire("Success", res.data.message, "success");
            fetchPending();
            handleCloseModal();
          } else {
            Swal.fire("Error", res.data.message, "error");
          }
        })
        .catch(() => {
          setLoad(false);
          Swal.fire("Error", "Something went wrong", "error");
        });
    });
  };

  /* ================= MODAL HANDLERS ================= */
  const handleViewClick = (expense) => {
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
  const handleCloseModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  /* ================= ATTACHMENT DOWNLOAD ================= */
  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Pending Expenses (Zonal Head)" />

      {/* Loader */}
      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        size={200}
        loading={load}
      />

      {/* Search + CSV */}
      {!load && (
        <div className="container-fluid mb-3">
          <div className="row align-items-center">
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
                filename="ZH_Pending_Expenses.csv"
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
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentExpenses.length > 0 ? (
                    currentExpenses.map((el, index) => (
                      <tr key={el._id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{el.ticketId}</td>
                        <td>{el.storeId?.storeName}</td>
                        <td>{el.expenseHeadId?.name}</td>
                        <td>₹ {el.amount}</td>
                        <td>
                          <span className="badge bg-warning">Pending</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleViewClick(el)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No Pending Expenses Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
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
          </div>
        </div>
      )}

      {/* Modal with Approve/Hold/Reject */}
      {showModal && selectedExpense && (
        <div
          className="modal show d-block"
          tabIndex="-1"
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
                      <div className="text-muted small">Store</div>
                      <div className="fw-semibold">{selectedExpense.storeId?.storeName}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Expense Head</div>
                      <div className="fw-semibold">{selectedExpense.expenseHeadId?.name}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Amount</div>
                      <div className="fw-semibold text-success">
                        ₹ {selectedExpense.amount}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Policy</div>
                      <div>{selectedExpense.policy || "-"}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Nature of Expense</div>
                      <div>{selectedExpense.natureOfExpense || "-"}</div>
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
                      <span className="badge bg-warning px-3 py-2">
                        {selectedExpense.currentStatus}
                      </span>
                    </div>

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
                          <span className="text-muted">No Attachment</span>
                        )}
                    </div>

                  </div>

                  {/* Timeline */}
                  <ExpenseTimeline
                    expense={selectedExpense}
                    approvalHistory={approvalHistory}
                  />

                </div>

              </div>

              {/* Modal Footer with Actions */}
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => takeAction("Approve", selectedExpense._id)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => takeAction("Hold", selectedExpense._id)}
                >
                  Hold
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => takeAction("Reject", selectedExpense._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
