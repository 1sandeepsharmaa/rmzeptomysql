// hold expense
import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ExpenseTimeline from "../../common/ExpenseTimeline";

export default function HoldExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resubmitFile, setResubmitFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fmComment, setFmComment] = useState("");
  const [fileError, setFileError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  /* ================= FETCH HOLD EXPENSES ================= */
  const userId = sessionStorage.getItem("userId");
  useEffect(() => {

    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    ApiServices.MyExpenses({
      userId,
      currentStatus: "Hold",
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
    Status: "Hold",
    CreatedAt: new Date(el.createdAt).toLocaleDateString(),
  }));

  /* ================= MODAL HANDLERS ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setResubmitFile(null);
    setFmComment("");
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
    setResubmitFile(null);
    setFmComment("");
    setFileError(false);
    setCommentError(false);
    setShowModal(false);
  };
  /* ================= RESUBMIT ================= */
  const handleResubmit = () => {

    const isFileMissing = !resubmitFile;
    const isCommentMissing = !fmComment.trim();

    setFileError(isFileMissing);
    setCommentError(isCommentMissing);

    if (isFileMissing || isCommentMissing) return;

    const formData = new FormData();
    formData.append("expenseId", selectedExpense._id);
    formData.append("approverId", userId);
    formData.append("resubmittedAttachment", resubmitFile);
    formData.append("fmComment", fmComment);

    setSubmitting(true);

    ApiServices.ReSubmitHeldExpense(formData)
      .then((res) => {
        if (res?.data?.success) {

          handleCloseModal();
          setLoad(true);

          ApiServices.MyExpenses({
            userId,
            currentStatus: "Hold",
          }).then((res) => {
            setData(res?.data?.data || []);
            setLoad(false);
          });

        } else {
          Swal.fire("Error", "Resubmission failed", "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "Something went wrong", "error");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Hold Expenses" />

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
                filename="Hold_Expenses.csv"
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
            <div className="col-lg-12 mt-3 table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Sr. No</th>
                    <th>Ticket ID</th>
                    <th>Store</th>
                    <th>Expense Head</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created At</th>
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
                        <td>
                          <span className="badge bg-warning text-dark">
                            Hold
                          </span>
                        </td>
                        <td>
                          {new Date(el.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            type="button"
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
                      <td colSpan={8} className="text-center text-muted">
                        No Hold Expenses Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
      )}
      {/* ================= MODAL ================= */}
      {showModal && selectedExpense && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
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
                {/* <div className="row g-3"> */}

                <div className="p-4 mb-4 rounded shadow-sm bg-light border">
                  <div className="row g-3">

                    <div className="col-md-6">
                      <div>
                        <div className="text-muted small">Ticket ID</div>
                        <div className="fw-semibold">{selectedExpense.ticketId}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div>
                        <div className="text-muted small">Store</div>
                        <div className="fw-semibold">{selectedExpense.storeId?.storeName}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div>
                        <div className="text-muted small">Expense Head</div>
                        <div className="fw-semibold">{selectedExpense.expenseHeadId?.name}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div>
                        <div className="text-muted small">Amount</div>
                        <div className="fw-semibold text-success">₹ {selectedExpense.amount}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div>
                        <div className="text-muted small">Policy</div>
                        <div className="fw-semibold">{selectedExpense.policy || "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div>
                        <div className="text-muted small">Nature of Expense</div>
                        <div className="fw-semibold">{selectedExpense.natureOfExpense}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div>
                        <div className="text-muted small">RCA</div>
                        <div>{selectedExpense.rca || "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div>
                        <div className="text-muted small">Remarks</div>
                        <div>{selectedExpense.remark || "-"}</div>
                      </div>
                    </div>

                    {/* Status + Hold Comment */}
                    <div className="col-md-6">
                      <div className="text-muted small">Status</div>
                      <span className="badge bg-warning text-dark px-3 py-2">
                        {selectedExpense.currentStatus}
                      </span>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Latest Hold Comment</div>
                      <div className="text-danger fw-semibold">
                        {selectedExpense.holdComment || "-"}
                      </div>
                    </div>

                  </div>

                  {/* ===== ATTACHMENTS ===== */}


                  {/* ===== FULL TIMELINE ===== */}
                  <ExpenseTimeline
                    expense={selectedExpense}
                    approvalHistory={approvalHistory}
                  />



                  {/* ===== RESUBMIT FILE ===== */}
                  <div className="row mt-4 g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Upload New Attachment (Required)
                      </label>
                      <input
                        type="file"
                        className={`form-control ${fileError ? "is-invalid" : ""}`}
                        onChange={(e) => {
                          setResubmitFile(e.target.files[0]);
                          if (e.target.files[0]) setFileError(false);
                        }}
                      />

                      {fileError && (
                        <div className="invalid-feedback">
                          Attachment is required
                        </div>
                      )}

                    </div>
                    <div className="col-6">
                      <label className="form-label">FM Comment (Required)</label>
                      <input
                        className={`form-control ${commentError ? "is-invalid" : ""}`}
                        value={fmComment}
                        onChange={(e) => {
                          setFmComment(e.target.value);
                          if (e.target.value.trim()) setCommentError(false);
                        }}
                      />

                      {commentError && (
                        <div className="invalid-feedback">
                          FM Comment is required
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  disabled={submitting}
                  onClick={handleResubmit}
                >
                  {submitting ? "Submitting..." : "Resubmit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </main>
  );
}
