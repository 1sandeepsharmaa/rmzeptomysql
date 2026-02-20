import { useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function AddApprovalPolicy() {

    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [approvalLevels, setApprovalLevels] = useState([]);
    const [load, setLoad] = useState(false);

    // ✅ UPDATED ROLES (PR/PO ADDED)
    const roles = [
        "CLM",
        "ZONAL_HEAD",
        "BUSINESS_FINANCE",
        "PR/PO",
        "PROCUREMENT"
    ];

    function handleRoleToggle(role) {
        if (approvalLevels.includes(role)) {
            setApprovalLevels(prev => prev.filter(r => r !== role));
        } else {
            setApprovalLevels(prev => [...prev, role]);
        }
    }

    function handleForm(e) {
        e.preventDefault();

        if (minAmount === "" || maxAmount === "") {
            Swal.fire("Error", "Min & Max amount are required", "error");
            return;
        }

        if (approvalLevels.length === 0) {
            Swal.fire("Error", "Select at least one approval level", "error");
            return;
        }

        let data = {
            minAmount: Number(minAmount),
            maxAmount: Number(maxAmount),
            approvalLevels: approvalLevels
        };

        setLoad(true);

        ApiServices.AddApprovalPolicy(data)
            .then(res => {
                setLoad(false);
                if (res?.data?.success) {
                    Swal.fire("Success", res.data.message, "success");
                    setMinAmount("");
                    setMaxAmount("");
                    setApprovalLevels([]);
                } else {
                    Swal.fire("Error", res.data.message, "error");
                }
            })
            .catch(() => {
                setLoad(false);
                Swal.fire("Error", "Something went wrong", "error");
            });
    }

    return (
        <main id="main" className="main">
            <PageTitle child="Add Approval Policy" />

            <div className="container-fluid">
                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                    loading={load}
                />

                <div className={load ? "display-screen" : ""}>
                    <div className="col-lg-6 mx-auto mt-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Approval Policy Details</h5>

                                <form className="row g-3" onSubmit={handleForm}>

                                    <div className="col-12">
                                        <label className="form-label">Min Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={minAmount}
                                            onChange={(e) => setMinAmount(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Max Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={maxAmount}
                                            onChange={(e) => setMaxAmount(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Approval Levels</label>
                                        <div className="border rounded p-2">

                                            {roles.map(role => {
                                                const index = approvalLevels.indexOf(role);

                                                return (
                                                    <div
                                                        key={role}
                                                        className="form-check d-flex align-items-center gap-2"
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={index !== -1}
                                                            onChange={() => handleRoleToggle(role)}
                                                        />

                                                        <label className="form-check-label">
                                                            {role}
                                                            {index !== -1 && (
                                                                <span
                                                                    className="badge ms-2"
                                                                    style={{ background: "#6776f4" }}
                                                                >
                                                                    {index + 1}
                                                                </span>
                                                            )}
                                                        </label>
                                                    </div>
                                                );
                                            })}

                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn"
                                            style={{ background: "#6776f4", color: "white" }}
                                        >
                                            Submit
                                        </button>
                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
