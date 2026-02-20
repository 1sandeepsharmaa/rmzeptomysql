import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiServices from "../../ApiServices";
import { ScaleLoader } from "react-spinners";

export default function ZcDashboard() {
    const userId = sessionStorage.getItem("userId");

    const [load, setLoad] = useState(false);
    const [counts, setCounts] = useState({
        pending: 0,
        hold: 0,
        approved: 0,
        rejected: 0,
    });

    useEffect(() => {
        if (!userId) return;

        setLoad(true);

        Promise.all([
            // 🔵 Pending (ZH)
            ApiServices.ZcPendingExpense({
                userId,
                currentApprovalLevel: "ZONAL_COMMERCIAL",
                postApprovalStage: "ZC_VERIFY",
            }),



            // 🟢 Approved (ZH)
            ApiServices.MyApprovalActions({
                userId,
                level: "ZONAL_COMMERCIAL",
                action: "Closed"
            })

        ])
            .then(([pendingRes, approvedRes]) => {
                setCounts({
                    pending: pendingRes?.data?.data?.length || 0,
                    approved: approvedRes?.data?.data?.length || 0,
                });
                setLoad(false);
            })
            .catch((err) => {
                console.log("❌ ZH DASHBOARD ERROR", err);
                setLoad(false);
            });
    }, [userId]);

    return (
        <main id="main" className="main" style={{ position: "relative" }}>
            {load && (
                <div
                    style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <ScaleLoader color="#6776f4" />
                </div>
            )}

            <div className="container-fluid my-4">
                <h3 style={{ color: "#012970" }}>
                    <strong>Zonal Commercial Dashboard</strong>
                </h3>

                <div className="row mt-4 g-3">
                    <Card
                        title="Pending Requests"
                        value={counts.pending}
                        color="#FFC107"
                        icon="bi-hourglass-split"
                        link="/ZonalCommercial/pendingTickets"
                    />


                    <Card
                        title="Approved"
                        value={counts.approved}
                        color="#28A745"
                        icon="bi-check-circle-fill"
                        link="/ZonalCommercial/approvedTickets"
                    />

                </div>
            </div>
        </main>
    );
}

/* 🔹 CARD – UI SAME AS CLM / FM */
function Card({ title, value, color, icon, link }) {
    return (
        <div className="col-6 col-md-6 col-xl-4">
            <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card info-card h-100">
                    <div className="card-body mb-4">
                        <h5 className="card-title">{title}</h5>
                        <div className="d-flex align-items-center mt-4">
                            <div
                                className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: 50, height: 50, backgroundColor: color }}
                            >
                                <i className={`bi ${icon} fs-4`} />
                            </div>
                            <h6 className="fw-bold mb-0">{value}</h6>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
