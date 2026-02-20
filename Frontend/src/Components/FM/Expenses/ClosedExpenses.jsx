// Closed Tickets (FM)
import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ExpenseTimeline from "../../common/ExpenseTimeline";
import { CSVLink } from "react-csv";

export default function ClosedTickets() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [approvalHistory, setApprovalHistory] = useState([]);

    // 🔎 Search
    const [searchTerm, setSearchTerm] = useState("");

    // 📄 Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        ApiServices.MyExpenses({
            userId,
            includeExecutionStage: true
        })
            .then((res) => {
                setData(res?.data?.success ? res.data.data || [] : []);
                setLoad(false);
            })
            .catch(() => {
                setData([]);
                setLoad(false);
            });
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
        Status: el.currentStatus,
        PrismID: el.prismId || "-"
    }));

    const handleViewClick = (expense) => {
        setSelectedExpense(expense);
        setShowModal(true);

        ApiServices.ExpenseHistory({ expenseId: expense._id })
            .then(res => {
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

    return (
        <main className="main" id="main">
            <PageTitle child="Closed Tickets" />

            <ScaleLoader
                color="#6776f4"
                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                loading={load}
            />

            {!load && (
                <>
                    {/* 🔎 Search + CSV */}
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
                                    filename="FM_Closed_Tickets.csv"
                                    className="btn btn-primary btn-sm"
                                >
                                    Download CSV
                                </CSVLink>
                            </div>
                        </div>
                    </div>

                    {/* 📋 Table */}
                    <div className="container-fluid table-responsive">
                        <table className="table table-hover table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>S.No</th>
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
                                    currentExpenses.map((el, i) => (
                                        <tr key={el._id}>
                                            <td>
                                                {(currentPage - 1) * itemsPerPage + i + 1}
                                            </td>
                                            <td>{el.ticketId}</td>
                                            <td>{el.storeId?.storeName}</td>
                                            <td>{el.expenseHeadId?.name}</td>
                                            <td>₹ {el.amount}</td>
                                            <td>
                                                {el.currentStatus === "Closed" ? (
                                                    <span className="badge bg-secondary">
                                                        Closed
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark">
                                                        Pending
                                                    </span>
                                                )}
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
                                        <td colSpan="7" className="text-center text-muted">
                                            No Closed Tickets
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* 📄 Pagination */}
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
                                            <div className="text-muted small">Prism ID</div>
                                            <div>{selectedExpense.prismId || "-"}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Status</div>

                                            {selectedExpense.currentStatus === "Closed" ? (
                                                <span className="badge bg-secondary px-3 py-2">
                                                    Closed
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning text-dark px-3 py-2">
                                                    Pending
                                                </span>
                                            )}
                                        </div>


                                    </div>

                                    {/* ===== TIMELINE ===== */}
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
