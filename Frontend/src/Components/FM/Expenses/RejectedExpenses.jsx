// reject expense
import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ExpenseTimeline from "../../common/ExpenseTimeline";

export default function RejectedExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);
  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    ApiServices.MyExpenses({ userId, currentStatus: "Rejected" })
      .then((res) => {
        setData(res?.data?.success ? res.data.data || [] : []);
        setTimeout(() => setLoad(false), 500);
      })
      .catch(() => {
        setData([]);
        setTimeout(() => setLoad(false), 500);
      });
  }, []);

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
    setApprovalHistory([]);
    setShowModal(false);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const showPagination = data.length > itemsPerPage;
  const currentExpenses = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <main className="main" id="main">
      <PageTitle child="Rejected Expenses" />

      {/* Loader */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <ScaleLoader
              color="#6776f4"
              cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
              size={200}
              loading={load}
            />
          </div>
        </div>
      </div>

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
                    <th>Created At</th>
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
                          <span className="badge bg-danger">Rejected</span>
                        </td>
                        <td>{new Date(el.createdAt).toLocaleDateString()}</td>
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
                        No Rejected Expenses Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

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
          </div>
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
                      <span className="badge bg-danger px-3 py-2">
                        Rejected
                      </span>
                    </div>

                  </div>

                  {/* ===== FULL TIMELINE ===== */}
                  <ExpenseTimeline
                    expense={selectedExpense}
                    approvalHistory={approvalHistory}
                  />


                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}