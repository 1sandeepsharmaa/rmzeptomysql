// import { ScaleLoader } from "react-spinners";
// import PageTitle from "../PageTitle";
// import { useEffect, useState } from "react";
// import ApiServices from "../../ApiServices";
// import { Link } from "react-router-dom";

// export default function ZonalHeadDashboard() {
//   const [load, setLoad] = useState(false);
//   const [data, setData] = useState({
//     assignedRequests: 0,
//     inProcess: 0,
//     pendingApprovals: 0,
//     approved: 0,
//     rejected: 0,
//     missedDeadlines: 0,
//   });

//   useEffect(() => {
//     setLoad(true);
//     ApiServices.ZonalHeadDashboard()
//       .then((res) => {
//         const d = res?.data?.data || {};

//         setData({
//           assignedRequests: d.assignedRequests ?? 0,
//           inProcess: d.inProcess ?? 0,
//           pendingApprovals: d.pendingApprovals ?? 0,
//           approved: d.approved ?? 0,
//           rejected: d.rejected ?? 0,
//           missedDeadlines: d.missedDeadlines ?? 0,
//         });

//         setLoad(false);
//       })
//       .catch(() => {
//         setLoad(false);
//       });
//   }, []);

//   const cards = [
//     {
//       title: "Assigned Requests",
//       value: data.assignedRequests,
//       color: "#4B49AC",
//       icon: "bi-inbox",
//       link: "/zonalHead/assignedRequests",
//     },
//     {
//       title: "In Process",
//       value: data.inProcess,
//       color: "#FDA403",
//       icon: "bi-arrow-repeat",
//       link: "/zonalHead/inProcess",
//     },
//     {
//       title: "Pending Approvals",
//       value: data.pendingApprovals,
//       color: "#00B8D9",
//       icon: "bi-hourglass-split",
//       link: "/zonalHead/pendingApprovals",
//     },
//     {
//       title: "Approved",
//       value: data.approved,
//       color: "#20C997",
//       icon: "bi-check-circle",
//       link: "/zonalHead/approved",
//     },
//     {
//       title: "Rejected",
//       value: data.rejected,
//       color: "#FF6B6B",
//       icon: "bi-x-circle",
//       link: "/zonalHead/rejected",
//     },
//     {
//       title: "Missed Deadlines",
//       value: data.missedDeadlines,
//       color: "#DC3545",
//       icon: "bi-exclamation-triangle",
//       link: "/zonalHead/missedDeadlines",
//     },
//   ];

//   return (
//     <main id="main" className="main">
//       <PageTitle child="Zonal Head Dashboard" />

//       {load && (
//         <div className="container-fluid text-center mt-5">
//           <ScaleLoader color="#6776f4" />
//         </div>
//       )}

//       {!load && (
//         <div className="row">
//           {cards.map((card, i) => (
//             <div key={i} className="col-xxl-4 col-md-6 mb-4">
//               <Link
//                 to={card.link}
//                 style={{ textDecoration: "none", color: "inherit" }}
//               >
//                 <div className="card info-card h-100">
//                   <div className="card-body">
//                     <h5 className="card-title">{card.title}</h5>

//                     <div className="d-flex align-items-center">
//                       <div
//                         className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                         style={{
//                           width: 50,
//                           height: 50,
//                           background: card.color,
//                         }}
//                       >
//                         <i className={`bi ${card.icon} fs-4`} />
//                       </div>
//                       <h6 className="mb-0 fw-bold">{card.value}</h6>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }


// changes
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiServices from "../../ApiServices";
import { ScaleLoader } from "react-spinners";

export default function ZonalHeadDashboard() {
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
      ApiServices.GetZhPendingExpenses({ userId }),

      // 🟡 Hold (ZH)
      ApiServices.MyApprovalActions({
        userId,
        action: "Hold",
        level: "ZONAL_HEAD",
      }),

      // 🟢 Approved (ZH)
      ApiServices.MyApprovalActions({
        userId,
        action: "Approved",
        level: "ZONAL_HEAD",
      }),

      // 🔴 Rejected (ZH)
      ApiServices.MyApprovalActions({
        userId,
        action: "Rejected",
        level: "ZONAL_HEAD",
      }),
    ])
      .then(([pendingRes, holdRes, approvedRes, rejectedRes]) => {
        setCounts({
          pending: pendingRes?.data?.data?.length || 0,
          hold: holdRes?.data?.data?.length || 0,
          approved: approvedRes?.data?.data?.length || 0,
          rejected: rejectedRes?.data?.data?.length || 0,
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
          <strong>Zonal Head Dashboard</strong>
        </h3>

        <div className="row mt-4 g-3">
          <Card
            title="Pending Requests"
            value={counts.pending}
            color="#FFC107"
            icon="bi-hourglass-split"
            link="/ZonalHead/pendingExpenses"
          />

          <Card
            title="Hold Requests"
            value={counts.hold}
            color="#6c757d"
            icon="bi-pause-circle-fill"
            link="/ZonalHead/holdExpenses"
          />

          <Card
            title="Approved"
            value={counts.approved}
            color="#28A745"
            icon="bi-check-circle-fill"
            link="/ZonalHead/approvedExpenses"
          />

          <Card
            title="Rejected"
            value={counts.rejected}
            color="#DC3545"
            icon="bi-x-circle-fill"
            link="/ZonalHead/rejectedExpenses"
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
