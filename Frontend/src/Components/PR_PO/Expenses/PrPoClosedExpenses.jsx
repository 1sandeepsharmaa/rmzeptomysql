// PR/PO Closed Tickets
import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ExpenseTimeline from "../../common/ExpenseTimeline";
import { CSVLink } from "react-csv";

export default function PrPoClosedExpense() {

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

    /* ================= FETCH CLOSED (PR/PO) ================= */
    useEffect(() => {

        if (!userId) {
            Swal.fire("Error", "User not logged in", "error");
            setLoad(false);
            return;
        }

        setLoad(true);

        ApiServices.MyApprovalActions({
            userId,
            action: "Closed",
            level: "PR/PO"
        })
            .then((res) => {
                setData(res?.data?.success ? res.data.data || [] : []);
            })
            .finally(() => setLoad(false));

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
        Status: "Closed",
        ClosedOn: el.actionAt
            ? new Date(el.actionAt).toLocaleDateString()
            : "-"
    }));

    /* ================= VIEW ================= */
    const handleViewClick = (item) => {

        const expense = item.expenseId;

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

            <PageTitle child="Closed Expenses (PR/PO)" />

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
                                    filename="PRPO_Closed_Expenses.csv"
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
                                    <th>Closed On</th>
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
                                            <td>{el.expenseId?.ticketId}</td>
                                            <td>{el.expenseId?.storeId?.storeName}</td>
                                            <td>{el.expenseId?.expenseHeadId?.name}</td>
                                            <td>₹ {el.expenseId?.amount}</td>
                                            <td>
                                                <span className="badge bg-secondary">
                                                    Closed
                                                </span>
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
                                        <td colSpan="8" className="text-center text-muted">
                                            No Closed Expenses Found
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
                                            <span className="badge bg-secondary px-3 py-2">
                                                Closed
                                            </span>
                                        </div>

                                    </div>

                                    {/* ================= TIMELINE ================= */}
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
