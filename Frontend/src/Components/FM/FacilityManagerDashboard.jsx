import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiServices from "../../ApiServices";
import { ScaleLoader } from "react-spinners";

export default function FacilityManagerDashboard() {
  const userId = sessionStorage.getItem("userId");

  const [load, setLoad] = useState(false);
  const [counts, setCounts] = useState({
    assignedRequests: 0,
    inProcess: 0,
    pendingApprovals: 0,
    approved: 0,
    rejected: 0,
    closed: 0,
  });

  useEffect(() => {
    setLoad(true);

    Promise.all([
      // Pending
      ApiServices.MyExpenses({
        userId,
        currentStatus: "Pending",
      }),

      // Hold
      ApiServices.MyExpenses({
        userId,
        currentStatus: "Hold",
      }),

      // Approved
      ApiServices.MyExpenses({
        userId,
        currentStatus: "Approved",
      }),

      // Rejected
      ApiServices.MyExpenses({
        userId,
        currentStatus: "Rejected",
      }),

      // Closed
      ApiServices.MyExpenses({
        userId,
        currentStatus: "Closed",
      }),
    ])
      .then(
        ([
          pendingRes,
          holdRes,
          approvedRes,
          rejectedRes,
          closedRes,
        ]) => {
          const pending = pendingRes?.data?.data?.length || 0;
          const hold = holdRes?.data?.data?.length || 0;
          const approved = approvedRes?.data?.data?.length || 0;
          const rejected = rejectedRes?.data?.data?.length || 0;
          const closed = closedRes?.data?.data?.length || 0;

          setCounts({
            assignedRequests: pending + hold,
            inProcess: hold,
            pendingApprovals: pending,
            approved,
            rejected,
            closed,
          });

          setLoad(false);
        }
      )
      .catch((err) => {
        console.log("FM DASHBOARD ERROR ❌", err);
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
            zIndex: 10,
          }}
        >
          <ScaleLoader color="#6776f4" />
        </div>
      )}

      <div className="container-fluid my-4">
        <h3 style={{ color: "#012970" }}>
          <strong>Facility Manager Dashboard</strong>
        </h3>

        <div className="row mt-4 g-3">
          <Card
            title="Assigned Requests"
            value={counts.assignedRequests}
            color="#4B49AC"
            icon="bi-kanban-fill"
            link="/fm/assignedRequest"
          />

          <Card
            title="In Process"
            value={counts.inProcess}
            color="#FFA500"
            icon="bi-clock-history"
            link="/fm/holdExpenses"
          />

          <Card
            title="Pending Approvals"
            value={counts.pendingApprovals}
            color="#17A2B8"
            icon="bi-hourglass-split"
            link="/fm/pendingExpenses"
          />

          <Card
            title="Approved"
            value={counts.approved}
            color="#28A745"
            icon="bi-check-circle-fill"
            link="/fm/approvedExpenses"
          />

          <Card
            title="Rejected"
            value={counts.rejected}
            color="#DC3545"
            icon="bi-x-circle-fill"
            link="/fm/rejectedExpenses"
          />

          <Card
            title="Closed Requests"
            value={counts.closed}
            color="#6c757d"
            icon="bi-lock-fill"
            link="/fm/closedExpenses"
          />
        </div>
      </div>
    </main>
  );
}

/* 🔹 Reusable Clickable Card */
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
