// Zonal Commercial - Pending Tickets
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import ApiServices from "../../ApiServices";
import PageTitle from "../PageTitle";
import ExpenseTimeline from "../common/ExpenseTimeline";

export default function ZcPendingTickets() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [prismId, setPrismId] = useState("");
    const [approvalHistory, setApprovalHistory] = useState([]);

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        ApiServices.ZcPendingExpense({
            userId,
            currentApprovalLevel: "ZONAL_COMMERCIAL",
            postApprovalStage: "ZC_VERIFY",
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

    const handleView = (exp) => {
        setSelected(exp);
        setPrismId("");
        setShowModal(true);

        ApiServices.ExpenseHistory({ expenseId: exp._id })
            .then((res) => {
                setApprovalHistory(res?.data?.data || []);
            })
            .catch(() => {
                setApprovalHistory([]);
            });
    };


    const handleClose = () => {
        setSelected(null);
        setShowModal(false);
    };

    const handleVerifyClose = () => {
        if (!prismId) {
            return Swal.fire("Error", "Prism ID is required", "error");
        }

        ApiServices.VerifyAndCloseExpense({
            expenseId: selected._id,
            prismId,
            approverId: userId   // ✅ THIS IS THE FIX
        })
            .then((res) => {
                if (res?.data?.success) {
                    Swal.fire("Closed", "Ticket closed successfully", "success");
                    setData((prev) => prev.filter((e) => e._id !== selected._id));
                    handleClose();
                } else {
                    Swal.fire("Error", res.data.message, "error");
                }
            })
            .catch(() => {
                Swal.fire("Error", "Closing failed", "error");
            });
    };


    return (
        <main className="main" id="main">
            <PageTitle child="Pending Tickets (Zonal Commercial)" />

            {load ? (
                <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} />
            ) : (
                <div className="container-fluid mt-4 table-responsive">
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Ticket ID</th>
                                <th>Store</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length ? (
                                data.map((el, i) => (
                                    <tr key={el._id}>
                                        <td>{i + 1}</td>
                                        <td>{el.ticketId}</td>
                                        <td>{el.storeId?.storeName}</td>
                                        <td>₹ {el.amount}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleView(el)}
                                            >
                                                Verify
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        No Pending Tickets
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===== MODAL ===== */}
            {/* ===== MODAL ===== */}
            {showModal && selected && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Expense Details (Zonal Commercial)</h5>
                                <button
                                    type="button"
                                    onClick={handleClose}
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

                                    {/* ================= BASIC DETAILS ================= */}
                                    <div className="row g-3">

                                        <div className="col-md-6">
                                            <div className="text-muted small">Ticket ID</div>
                                            <div className="fw-semibold">{selected.ticketId}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Store</div>
                                            <div className="fw-semibold">{selected.storeId?.storeName}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Expense Head</div>
                                            <div className="fw-semibold">{selected.expenseHeadId?.name}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Amount</div>
                                            <div className="fw-semibold text-success">₹ {selected.amount}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Policy</div>
                                            <div className="fw-semibold">{selected.policy || "-"}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Nature of Expense</div>
                                            <div className="fw-semibold">{selected.natureOfExpense || "-"}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Status</div>
                                            <span className="badge bg-warning px-3 py-2">
                                                Pending Verification
                                            </span>
                                        </div>

                                    </div>

                                    {/* ================= TIMELINE ================= */}
                                    <ExpenseTimeline
                                        expense={selected}
                                        approvalHistory={approvalHistory}
                                    />

                                    {/* ================= ZC ACTION ================= */}
                                    <div className="mt-4">
                                        <h6 className="fw-semibold text-primary">
                                            Zonal Commercial Action
                                        </h6>

                                        <div className="row g-3 mt-2">

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Prism ID *
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={prismId}
                                                    onChange={(e) => setPrismId(e.target.value)}
                                                    placeholder="Enter Prism ID"
                                                />
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-success"
                                    onClick={handleVerifyClose}
                                >
                                    Verify & Close Ticket
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}

        </main>
    );
}
