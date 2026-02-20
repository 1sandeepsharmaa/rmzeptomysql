import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiServices from "../../ApiServices";
import { ScaleLoader } from "react-spinners";

export default function PrPoDashboard() {
  const userId = sessionStorage.getItem("userId");

  const [load, setLoad] = useState(false);
  const [counts, setCounts] = useState({
    pendingApprovals: 0,
    hold: 0,
    approved: 0,
    rejected: 0,
    closedRes: 0,
  });

  useEffect(() => {
    if (!userId) return;

    setLoad(true);

    Promise.all([
      // 🔵 PENDING → ALAG API
      ApiServices.GetPrPoPendingExpenses({ userId }),

      // 🟡 HOLD → MyApprovalActions
      ApiServices.MyApprovalActions({
        userId,
        action: "Hold",
        level: "PR/PO",
      }),

      // 🟢 APPROVED
      ApiServices.MyApprovalActions({
        userId,
        action: "Approved",
        level: "PR/PO",
      }),

      // 🔴 REJECTED
      ApiServices.MyApprovalActions({
        userId,
        action: "Rejected",
        level: "PR/PO",
      }),

      // Closed
      ApiServices.MyApprovalActions({
        userId,
        action: "Closed",
        level: "PR/PO"
      })
    ])
      .then(([pendingRes, holdRes, approvedRes, rejectedRes, closedRes]) => {
        setCounts({
          pendingApprovals: pendingRes?.data?.data?.length || 0,
          hold: holdRes?.data?.data?.length || 0,
          approved: approvedRes?.data?.data?.length || 0,
          rejected: rejectedRes?.data?.data?.length || 0,
          closed: closedRes?.data?.data?.length || 0

        });

        setLoad(false);
      })
      .catch((err) => {
        console.log("❌ PR/PO DASHBOARD ERROR", err);
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
          <strong>PR / PO Dashboard</strong>
        </h3>

        <div className="row mt-4">
          <Card
            title="Pending Approvals"
            value={counts.pendingApprovals}
            color="#17A2B8"
            icon="bi-hourglass-split"
            link="/PR_PO/pendingExpenses"
          />

          <Card
            title="Hold Requests"
            value={counts.hold}
            color="#6c757d"
            icon="bi-pause-circle-fill"
            link="/PR_PO/holdExpenses"
          />

          <Card
            title="Approved"
            value={counts.approved}
            color="#28A745"
            icon="bi-check-circle-fill"
            link="/PR_PO/approvedExpenses"
          />

          <Card
            title="Rejected"
            value={counts.rejected}
            color="#DC3545"
            icon="bi-x-circle-fill"
            link="/PR_PO/rejectedExpenses"
          />

          <Card
            title="Closed Requests"
            value={counts.closed}
            color="#6c757d"
            icon="bi-lock-fill"
            link="/PR_PO/closedExpenses"
          />
        </div>
      </div>
    </main>
  );
}

/* 🔹 CARD – SAME UI */
function Card({ title, value, color, icon, link }) {
  return (
    <div className="col-xxl-4 col-md-6 mb-4">
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
