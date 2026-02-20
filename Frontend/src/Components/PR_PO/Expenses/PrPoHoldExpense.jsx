// PR/PO HOLD EXPENSES
import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { CSVLink } from "react-csv";
import ExpenseTimeline from "../../common/ExpenseTimeline";

export default function PrpoHoldExpense() {
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

    /* ================= FETCH HOLD (PR/PO) ================= */
    const fetchHold = () => {
        if (!userId) {
            Swal.fire("Error", "User not logged in", "error");
            setLoad(false);
            return;
        }

        setLoad(true);

        ApiServices.MyApprovalActions({
            userId,
            action: "Hold",
            level: "PR/PO", // ✅ MOST IMPORTANT FIX
        })
            .then((res) => {
                setData(res?.data?.success ? res.data.data || [] : []);
            })
            .finally(() => setLoad(false));
    };

    useEffect(() => {
        fetchHold();
    }, []);

    /* ================= SEARCH FILTER ================= */
    const filteredData = data.filter(
        (el) =>
            el.expenseId?.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            el.expenseId?.storeId?.storeName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            el.expenseId?.expenseHeadId?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
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
        TicketID: el.expenseId?.ticketId,
        Store: el.expenseId?.storeId?.storeName,
        ExpenseHead: el.expenseId?.expenseHeadId?.name,
        Amount: el.expenseId?.amount,
        Status: "Hold",
        Comment: el.comment || "-",
        ActionDate: new Date(el.actionAt).toLocaleDateString(),
    }));

    /* ================= MODAL ================= */
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
            <PageTitle child="Hold Expenses (PR / PO)" />

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
                                filename="PRPO_Hold_Expenses.csv"
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
                    <div className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Sr. No</th>
                                    <th>Ticket ID</th>
                                    <th>Store</th>
                                    <th>Expense Head</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Comment</th>
                                    <th>Action Date</th>
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
                                            <td>{el.expenseId?.ticketId}</td>
                                            <td>{el.expenseId?.storeId?.storeName}</td>
                                            <td>{el.expenseId?.expenseHeadId?.name}</td>
                                            <td>₹ {el.expenseId?.amount}</td>
                                            <td>
                                                <span className="badge bg-secondary">Hold</span>
                                            </td>
                                            <td>{el.comment || "-"}</td>
                                            <td>
                                                {new Date(el.actionAt).toLocaleDateString()}
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
                                        <td colSpan="9" className="text-center text-muted">
                                            No Hold Expenses Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ================= MODAL (SAME UI AS BF / PRPO) ================= */}
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
                                            <div className="text-muted small">Status</div>
                                            <span className="badge bg-secondary px-3 py-2">
                                                Hold
                                            </span>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Hold Comment</div>
                                            <div className="text-danger fw-semibold">
                                                {selectedExpense.holdComment || "-"}
                                            </div>
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
