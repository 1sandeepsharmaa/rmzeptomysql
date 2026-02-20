import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { CSVLink } from "react-csv";
import ExpenseTimeline from "../../common/ExpenseTimeline";

export default function PrPoApprovedExpense() {
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

  /* ================= FETCH APPROVED (PR/PO) ================= */
  const fetchApproved = () => {
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    setLoad(true);

    ApiServices.MyApprovalActions({
      userId,
      action: "Approved",
      level: "PR/PO",
    })
      .then((res) => {
        setData(res?.data?.success ? res.data.data || [] : []);
        setLoad(false);
      })
      .catch(() => {
        setData([]);
        setLoad(false);
      });
  };

  useEffect(() => {
    fetchApproved();
  }, []);
  /* ================= SEARCH FILTER ================= */
  const filteredData = data.filter((el) =>
    el.expenseId?.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    el.expenseId?.storeId?.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    el.expenseId?.expenseHeadId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
    TicketID: el.expenseId?.ticketId,
    Store: el.expenseId?.storeId?.storeName,
    ExpenseHead: el.expenseId?.expenseHeadId?.name,
    Amount: el.expenseId?.amount,
    Status: "Approved",
    ApprovedOn: new Date(el.actionAt).toLocaleDateString(),
  }));
  /* ================= MODAL HANDLERS ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);

    ApiServices.ExpenseHistory({ expenseId: expense.expenseId?._id })
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

  return (
    <main className="main" id="main">
      <PageTitle child="Approved Expenses (PR/PO)" />

      {/* Loader */}
      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
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
                filename="CLM_Approved_Expenses.csv"
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
                    <th>Approved On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentExpenses.length ? (
                    currentExpenses.map((el, index) => (
                      <tr key={el._id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{el.expenseId?.ticketId}</td>
                        <td>{el.expenseId?.storeId?.storeName}</td>
                        <td>{el.expenseId?.expenseHeadId?.name}</td>
                        <td>₹ {el.expenseId?.amount}</td>
                        <td>
                          <span className="badge bg-success">Approved</span>
                        </td>
                        <td>
                          {el.actionAt
                            ? new Date(el.actionAt).toLocaleDateString()
                            : "-"}
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
                      <td colSpan={8} className="text-center text-muted">
                        No Approved Expenses Found
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

      {/* ================= MODAL ================= */}
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
                    borderRadius: "50%",
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
                      <div className="fw-semibold">
                        {selectedExpense.expenseId?.ticketId}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Store</div>
                      <div className="fw-semibold">
                        {selectedExpense.expenseId?.storeId?.storeName}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Expense Head</div>
                      <div className="fw-semibold">
                        {selectedExpense.expenseId?.expenseHeadId?.name}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Amount</div>
                      <div className="fw-semibold text-success">
                        ₹ {selectedExpense.expenseId?.amount}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Policy</div>
                      <div>{selectedExpense.expenseId?.policy || "-"}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Nature of Expense</div>
                      <div>{selectedExpense.expenseId?.natureOfExpense || "-"}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">RCA</div>
                      <div>{selectedExpense.expenseId?.rca || "-"}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Remarks</div>
                      <div>{selectedExpense.expenseId?.remark || "-"}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Status</div>
                      <span className="badge bg-success px-3 py-2">
                        Approved
                      </span>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Approved On</div>
                      <div>
                        {selectedExpense.actionAt
                          ? new Date(selectedExpense.actionAt).toLocaleString()
                          : "-"}
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="col-12">
                      <div className="text-muted small mb-1">Attachments</div>

                      {selectedExpense.expenseId?.attachment && (
                        <a
                          href={selectedExpense.expenseId.attachment}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-primary me-2"
                        >
                          Original
                        </a>
                      )}

                      {selectedExpense.expenseId?.resubmittedAttachment && (
                        <a
                          href={selectedExpense.expenseId.resubmittedAttachment}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-success"
                        >
                          Resubmitted
                        </a>
                      )}

                      {!selectedExpense.expenseId?.attachment &&
                        !selectedExpense.expenseId?.resubmittedAttachment && (
                          <span className="text-muted">No Attachment</span>
                        )}
                    </div>

                  </div>

                  {/* Timeline */}
                  <ExpenseTimeline
                    expense={selectedExpense.expenseId}
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
