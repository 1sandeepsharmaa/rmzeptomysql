import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import ApiServices from "../../../ApiServices";
import { CSVLink } from "react-csv";
import ExpenseTimeline from "../../common/ExpenseTimeline";
import { useLocation } from "react-router-dom";

export default function AllHoldExpense() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const isViewer = sessionStorage.getItem("userType") === "11";
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
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
    currentApprovalLevel: queryParams.get("currentApprovalLevel"),
  };
  /* ================= FETCH HOLD ================= */
  const fetchHold = () => {
    setLoad(true);

    ApiServices.AdminExpensesByStatus({ status: "Hold" })
      .then((res) => {
        if (res?.data?.success) {

          const list = res.data.data || [];

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

            if (appliedFilters.currentApprovalLevel &&
              e.currentApprovalLevel !== appliedFilters.currentApprovalLevel)
              return false;

            return true;
          });

          setData(filteredList);

          const total = filteredList.reduce(
            (sum, e) => sum + Number(e.amount || 0),
            0
          );

          setTotalAmount(total);

        } else {
          setData([]);
          setTotalAmount(0);
        }
      })
      .finally(() => setLoad(false));
  };


  useEffect(() => {
    fetchHold();
  }, []);

  /* ================= SEARCH ================= */
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

  /* ================= CSV ================= */
  const csvData = filteredData.map((el, index) => ({
    SrNo: index + 1,
    TicketID: el.ticketId,
    Store: el.storeId?.storeName,
    ExpenseHead: el.expenseHeadId?.name,
    Nature: el.natureOfExpense,
    Amount: el.amount,
    Status: "Hold",
    Comment: el.comment || "-",
    ActionDate: el.actionAt
      ? new Date(el.actionAt).toLocaleDateString()
      : "-",
  }));

  /* ================= MODAL ================= */
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

  return (
    <main className="main" id="main">
      <PageTitle child="Hold Expenses (Admin)" />

      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        size={200}
        loading={load}
      />

      {!load && (
        <>
          <div className="container-fluid mt-3">
            <h6 className="fw-bold text-secondary">
              Total Hold Amount : ₹ {totalAmount.toLocaleString()}
            </h6>
          </div>
          {/* SEARCH + CSV */}
          <div className="container-fluid mb-2">
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
                  filename="Admin_Hold_Expenses.csv"
                  className="btn btn-primary btn-sm"
                >
                  Download CSV
                </CSVLink>
              </div>
            </div>
          </div>


          {/* TABLE */}
          {/* TABLE */}
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-12 mt-4 table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No</th>
                      <th>Created At</th>
                      <th>Ticket ID</th>
                      <th>Store</th>
                      <th>Expense Head</th>
                      <th>Nature</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Hold Comment</th>
                      <th>Action Date</th>
                      {!isViewer && <th>Action</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {currentExpenses.length ? (
                      currentExpenses.map((el, index) => (
                        <tr key={el._id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>

                          <td>
                            {el.createdAt
                              ? new Date(el.createdAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                              : "-"}
                          </td>

                          <td>{el.ticketId}</td>
                          <td>{el.storeId?.storeName || "-"}</td>
                          <td>{el.expenseHeadId?.name || "-"}</td>
                          <td>
                            <span className={`badge ${el.natureOfExpense === 'CAPEX' ? 'bg-info' : 'bg-secondary'}`}>
                              {el.natureOfExpense}
                            </span>
                          </td>
                          <td>₹ {el.amount}</td>

                          <td>
                            <span className="badge bg-secondary">
                              Hold
                            </span>
                          </td>

                          <td>{el.holdComment || "-"}</td>

                          <td>
                            {el.updatedAt
                              ? new Date(el.updatedAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                              : "-"}
                          </td>

                          {!isViewer && (
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleViewClick(el)}
                              >
                                View
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={!isViewer ? 10 : 9} className="text-center text-muted">
                          No Hold Expenses Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </>
      )}

      {/* MODAL */}
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
                  className="btn-close"
                />
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
                        ₹ {selectedExpense.amount}
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

                    <div className="col-md-6">
                      <div className="text-muted small">Status</div>
                      <span className="badge bg-secondary px-3 py-2">
                        Hold
                      </span>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Hold Comment</div>
                      <div>{selectedExpense.comment || "-"}</div>
                    </div>

                  </div>

                  {/* Timeline */}
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
