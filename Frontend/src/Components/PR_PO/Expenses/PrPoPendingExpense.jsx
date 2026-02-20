import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { CSVLink } from "react-csv";
import ExpenseTimeline from "../../common/ExpenseTimeline";

export default function PrPoPendingExpense() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [prError, setPrError] = useState(false);
  const [poError, setPoError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // PR/PO inputs
  const [prComment, setPrComment] = useState("");
  const [poComment, setPoComment] = useState("");
  const [prAttachment, setPrAttachment] = useState(null);
  const [poAttachment, setPoAttachment] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const isPrPoStage =
    selectedExpense?.currentApprovalLevel === "PR/PO" &&
    (
      selectedExpense?.postApprovalStage === "NONE" ||
      selectedExpense?.postApprovalStage === null
    );
  const isEmailStage =
    selectedExpense?.currentApprovalLevel === "PR/PO" &&
    selectedExpense?.postApprovalStage === "PRPO_EMAIL";
  const userId = sessionStorage.getItem("userId");

  /* ================= FETCH PENDING (PR/PO) ================= */
  const fetchPending = () => {
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    setLoad(true);

    ApiServices.GetPrPoPendingExpenses({ userId })
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

  /* ================= MODAL ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setPrComment("");
    setPoComment("");
    setPrAttachment(null);
    setPoAttachment(null);
    setEmailSubject("");
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
    setShowModal(false);
    setSelectedExpense(null);
    setPrComment("");
    setPoComment("");
    setPrError(false);
    setPoError(false);
    setEmailError(false);
    setPrAttachment(null);
    setPoAttachment(null);
    setEmailSubject("");
  };

  /* ================= ACTION HANDLER ================= */
  const takeAction = (type) => {
    const formData = new FormData();

    formData.append("expenseId", selectedExpense._id);
    formData.append("approverId", userId);

    // ================= COMMON VALIDATION =================
    const isPrMissing = !prComment.trim();
    const isPoMissing = !poComment.trim();

    setPrError(isPrMissing);
    setPoError(isPoMissing);

    if (isPrMissing || isPoMissing) return;


    // ================= COMMON FIELDS =================
    formData.append("prComment", prComment);
    formData.append("poComment", poComment);
    formData.append("comment", `PR: ${prComment} | PO: ${poComment}`);

    // ================= OPTIONAL ATTACHMENTS =================
    if (prAttachment instanceof File) {
      formData.append("prAttachment", prAttachment);
    }

    if (poAttachment instanceof File) {
      formData.append("poAttachment", poAttachment);
    }

    // ================= API CALL =================
    let apiCall;
    if (type === "Approve") apiCall = ApiServices.ApproveExpense;
    if (type === "Hold") apiCall = ApiServices.HoldExpense;
    if (type === "Reject") apiCall = ApiServices.RejectExpense;

    setLoad(true);

    apiCall(formData)
      .then((res) => {
        setLoad(false);
        if (res?.data?.success) {
          Swal.fire("Success", res.data.message, "success");
          handleCloseModal();
          fetchPending();
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      })
      .catch(() => {
        setLoad(false);
        Swal.fire("Error", "Something went wrong", "error");
      });
  };

  const closeExpense = () => {
    const isEmailMissing = !emailSubject.trim();
    setEmailError(isEmailMissing);
    if (isEmailMissing) return;

    setLoad(true);

    ApiServices.PrpoEmailAndClose({
      expenseId: selectedExpense._id,
      prPoEmailSubject: emailSubject,
      approverId: userId
    })
      .then((res) => {
        setLoad(false);
        if (res?.data?.success) {
          Swal.fire("Success", res.data.message, "success");
          handleCloseModal();
          fetchPending();
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      })
      .catch(() => {
        setLoad(false);
        Swal.fire("Error", "Something went wrong", "error");
      });
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Pending Expenses (PR/PO)" />

      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

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
                filename="PRPO_Pending_Expenses.csv"
                className="btn btn-primary btn-sm"
              >
                Download CSV
              </CSVLink>
            </div>
          </div>
        </div>
      )}

      {!load && (
        <div className="container-fluid">
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
                {currentExpenses.length ? (
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
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
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
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body px-4">

                <div className="p-4 mb-4 rounded shadow-sm bg-light border">

                  {/* ================= BASIC DETAILS ================= */}
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
                        {selectedExpense.natureOfExpense || "-"}
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

                  </div>

                  {/* ================= TIMELINE ================= */}
                  <div className="mt-4">
                    <ExpenseTimeline
                      expense={selectedExpense}
                      approvalHistory={approvalHistory}
                    />
                  </div>
                  {/* ================= PR / PO SECTION ================= */}
                  {isPrPoStage && (
                    <>
                      <div className="row mt-4 g-3">

                        {/* PR */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            PR Comment *
                          </label>
                          <input
                            className={`form-control ${prError ? "is-invalid" : ""}`}
                            value={prComment}
                            onChange={(e) => {
                              setPrComment(e.target.value);
                              if (e.target.value.trim()) setPrError(false);
                            }}
                          />

                          {prError && (
                            <div className="invalid-feedback">
                              PR Comment is required
                            </div>
                          )}

                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            PR Attachment (Optional)
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setPrAttachment(e.target.files[0])}
                          />
                        </div>

                        {/* PO */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            PO Comment *
                          </label>
                          <input
                            className={`form-control ${poError ? "is-invalid" : ""}`}
                            value={poComment}
                            onChange={(e) => {
                              setPoComment(e.target.value);
                              if (e.target.value.trim()) setPoError(false);
                            }}
                          />

                          {poError && (
                            <div className="invalid-feedback">
                              PO Comment is required
                            </div>
                          )}

                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            PO Attachment (Optional)
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setPoAttachment(e.target.files[0])}
                          />
                        </div>

                      </div>
                    </>
                  )}

                  {/* ================= EMAIL STAGE ================= */}
                  {isEmailStage && (
                    <div className="row mt-4">
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Email Subject *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>
              <div className="modal-footer">

                {isPrPoStage && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => takeAction("Approve")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-warning"
                      onClick={() => takeAction("Hold")}
                    >
                      Hold
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => takeAction("Reject")}
                    >
                      Reject
                    </button>
                  </>
                )}

                {isEmailStage && (
                  <button
                    className="btn btn-success"
                    onClick={closeExpense}
                  >
                    Close
                  </button>
                )}

              </div>


            </div>
          </div>
        </div>
      )}
    </main>
  );
}
