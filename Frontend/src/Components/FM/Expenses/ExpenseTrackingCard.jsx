// // final
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ApiServices from "../../../ApiServices";

// const STEPS = ["Pending", "Approved", "Rejected"];

// // 🎨 Status based colors
// const STATUS_COLORS = {
//   Pending: "#facc15",   // yellow
//   Approved: "#22c55e",  // green
//   Rejected: "#ef4444",  // red
// };

// export default function TrackExpenses() {
//   const { id } = useParams(); // _id aa rahi hai
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);

//     ApiServices.GetSingleExpense({ _id: id })
//       .then((res) => {
//         const result = res?.data?.data;

//         if (Array.isArray(result)) {
//           setData(result[0] || null);
//         } else {
//           setData(result || null);
//         }

//         setLoading(false);
//       })
//       .catch(() => {
//         setData(null);
//         setLoading(false);
//       });
//   }, [id]);

//   if (!id) return null;

//   // ✅ SAFE currentStatus handling
//   const status = data?.currentStatus?.toString()?.trim() || "Pending";
//   const activeIndex = STEPS.indexOf(status);

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.4)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 999,
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 12,
//           padding: 24,
//           width: "420px",
//         }}
//       >
//         {/* Header */}
//         <div className="d-flex justify-content-between mb-3">
//           <h6 className="mb-0">Track Expense</h6>
//           <button
//             className="btn btn-sm btn-danger"
//             onClick={() => navigate(-1)}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Body */}
//         {loading && <p>Loading...</p>}

//         {!loading && !data && (
//           <p className="text-danger">
//             No data found for this expense.
//           </p>
//         )}

//         {!loading && data && (
//           <>
//             <p><b>Ticket ID:</b> {data.ticketId}</p>
//             <p><b>Store:</b> {data.storeId?.storeName}</p>
//             <p><b>Expense:</b> {data.expenseHeadId?.name}</p>
//             <p><b>Amount:</b> ₹ {data.amount}</p>
//             <p>
//               <b>Date:</b>{" "}
//               {new Date(data.createdAt).toLocaleDateString()}
//             </p>

//             {/* STATUS TIMELINE */}
//             <div className="mt-3">
//               {STEPS.map((step, index) => {
//                 const completed = index < activeIndex;
//                 const active = index === activeIndex;

//                 const color =
//                   active || completed
//                     ? STATUS_COLORS[step]
//                     : "#d1d5db";

//                 return (
//                   <div key={step} style={{ display: "flex", gap: 14 }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 14,
//                           height: 14,
//                           borderRadius: "50%",
//                           background: color,
//                         }}
//                       />
//                       {index !== STEPS.length - 1 && (
//                         <div
//                           style={{
//                             width: 2,
//                             height: 30,
//                             background: completed ? color : "#d1d5db",
//                           }}
//                         />
//                       )}
//                     </div>

//                     <div
//                       style={{
//                         fontWeight: active ? 600 : 400,
//                         color: active ? "#000" : "#9ca3af",
//                       }}
//                     >
//                       {step}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ApiServices from "../../../ApiServices";

// const STATUS_STYLE = {
//   Approved: { bg: "success", dot: "#22c55e" },
//   Pending: { bg: "warning", dot: "#facc15" },
//   Hold: { bg: "primary", dot: "#3b82f6" },
//   Rejected: { bg: "danger", dot: "#ef4444" },
// };

// export default function TrackExpenses() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [expense, setExpense] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     ApiServices.GetSingleExpense({ _id: id })
//       .then((res) => {
//         const data = res?.data?.data;
//         setExpense(Array.isArray(data) ? data[0] : data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setExpense(null);
//         setLoading(false);
//       });
//   }, [id]);

//   if (!id) return null;

//   return (
//     <div className="modal show d-block bg-dark bg-opacity-50">
//       <div className="modal-dialog modal-lg modal-dialog-centered">
//         <div className="modal-content rounded-4">

//           {/* HEADER */}
//           <div className="modal-header">
//             <h5 className="fw-bold">💲 Track Expense Approval</h5>
//             <button className="btn-close" onClick={() => navigate(-1)} />
//           </div>

//           {/* BODY */}
//           <div className="modal-body">
//             {loading && <p>Loading...</p>}

//             {!loading && !expense && (
//               <p className="text-danger">No data found.</p>
//             )}

//             {!loading && expense && (
//               <>
//                 {/* EXPENSE SUMMARY */}
//                 <div className="p-3 bg-light rounded-3 mb-4">
//                   <h6 className="fw-bold mb-1">
//                     {expense.expenseHeadId?.name}
//                   </h6>
//                   <div className="text-muted">
//                     ₹ {expense.amount} • {expense.natureOfExpense}
//                   </div>
//                   <small className="text-muted">
//                     {new Date(expense.createdAt).toDateString()}
//                   </small>
//                 </div>

//                 {/* APPROVAL JOURNEY */}
//                 <h6 className="text-uppercase text-muted mb-3">
//                   Approval Journey
//                 </h6>

//                 <div className="position-relative ms-2">
//                   {expense.approvalJourney?.map((step, index) => {
//                     const style =
//                       STATUS_STYLE[step.status] ||
//                       STATUS_STYLE.Pending;

//                     return (
//                       <div key={index} className="d-flex mb-4">
//                         {/* TIMELINE */}
//                         <div className="me-3 d-flex flex-column align-items-center">
//                           <span
//                             style={{
//                               width: 14,
//                               height: 14,
//                               borderRadius: "50%",
//                               background: style.dot,
//                             }}
//                           />
//                           {index !==
//                             expense.approvalJourney.length - 1 && (
//                             <div
//                               style={{
//                                 width: 2,
//                                 height: 40,
//                                 background: "#e5e7eb",
//                               }}
//                             />
//                           )}
//                         </div>

//                         {/* CARD */}
//                         <div className="card shadow-sm w-100 rounded-4 p-3">
//                           <div className="d-flex justify-content-between">
//                             <strong>{step.level}</strong>
//                             <span
//                               className={`badge bg-${style.bg}`}
//                             >
//                               {step.status}
//                             </span>
//                           </div>

//                           {step.approvedBy && (
//                             <small className="text-muted">
//                               👤 {step.approvedBy} • 📅{" "}
//                               {new Date(
//                                 step.approvedAt
//                               ).toLocaleString()}
//                             </small>
//                           )}

//                           {step.remark && (
//                             <div className="mt-2 fst-italic text-muted">
//                               “{step.remark}”
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // final – CARD BASED UI
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ApiServices from "../../../ApiServices";

// export default function TrackExpenses() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     ApiServices.GetSingleExpense({ _id: id })
//       .then((res) => {
//         const result = res?.data?.data;
//         setData(Array.isArray(result) ? result[0] : result);
//         setLoading(false);
//       })
//       .catch(() => {
//         setData(null);
//         setLoading(false);
//       });
//   }, [id]);

//   if (!id) return null;

//   /* ===============================
//      🔹 APPROVAL CARDS (TEMP LOGIC)
//      backend me jab approvalJourney
//      aayega, yahin replace ho jayega
//   =============================== */

//   const approvalCards = [
//     {
//       level: "CLM",
//       status: data?.currentStatus === "Pending" ? "Approved" : "Approved",
//       remark: "Approved as per budget",
//       user: "CLM Team",
//       date: data?.createdAt,
//     },
//     {
//       level: "ZH",
//       status: data?.currentStatus || "Pending",
//       remark:
//         data?.currentStatus === "Rejected"
//           ? "Budget exceeded"
//           : data?.currentStatus === "Hold"
//           ? "Waiting for vendor comparison"
//           : "",
//     },
//   ];

//   const statusStyle = {
//     Approved: {
//       bg: "#dcfce7",
//       color: "#16a34a",
//       dot: "#22c55e",
//     },
//     Pending: {
//       bg: "#fef3c7",
//       color: "#d97706",
//       dot: "#facc15",
//     },
//     Rejected: {
//       bg: "#fee2e2",
//       color: "#dc2626",
//       dot: "#ef4444",
//     },
//     Hold: {
//       bg: "#e0e7ff",
//       color: "#4338ca",
//       dot: "#3b82f6",
//     },
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.45)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 999,
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 16,
//           padding: 22,
//           width: 520,
//           maxHeight: "90vh",
//           overflowY: "auto",
//         }}
//       >
//         {/* HEADER */}
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="fw-bold mb-0">Track Expense Approval</h5>
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             onClick={() => navigate(-1)}
//           >
//             ✕
//           </button>
//         </div>

//         {loading && <p>Loading...</p>}

//         {!loading && !data && (
//           <p className="text-danger">No data found.</p>
//         )}

//         {!loading && data && (
//           <>
//             {/* EXPENSE SUMMARY */}
//             <div
//               style={{
//                 background: "#f9fafb",
//                 borderRadius: 12,
//                 padding: 14,
//                 marginBottom: 18,
//               }}
//             >
//               <h6 className="fw-bold mb-1">
//                 {data.expenseHeadId?.name}
//               </h6>
//               <div className="text-muted small">
//                 ₹ {data.amount} • {data.natureOfExpense} •{" "}
//                 {new Date(data.createdAt).toLocaleDateString()}
//               </div>
//             </div>

//             <h6 className="text-muted mb-3">APPROVAL JOURNEY</h6>

//             {/* APPROVAL CARDS */}
//             {approvalCards.map((step, index) => {
//               const style =
//                 statusStyle[step.status] || statusStyle.Pending;

//               return (
//                 <div
//                   key={index}
//                   style={{
//                     display: "flex",
//                     gap: 16,
//                     marginBottom: 20,
//                   }}
//                 >
//                   {/* DOT + LINE */}
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                     }}
//                   >
//                     <span
//                       style={{
//                         width: 14,
//                         height: 14,
//                         borderRadius: "50%",
//                         background: style.dot,
//                       }}
//                     />
//                     {index !== approvalCards.length - 1 && (
//                       <span
//                         style={{
//                           width: 2,
//                           height: 50,
//                           background: "#e5e7eb",
//                         }}
//                       />
//                     )}
//                   </div>

//                   {/* CARD */}
//                   <div
//                     style={{
//                       flex: 1,
//                       background:
//                         step.status === "Pending"
//                           ? "#fffbeb"
//                           : "#ffffff",
//                       borderRadius: 14,
//                       padding: 16,
//                       border:
//                         step.status === "Pending"
//                           ? "1px dashed #facc15"
//                           : "1px solid #e5e7eb",
//                     }}
//                   >
//                     <div className="d-flex justify-content-between mb-1">
//                       <div>
//                         <strong>{step.level}</strong>
//                         <div className="text-muted small">
//                           Approval Level
//                         </div>
//                       </div>

//                       <span
//                         style={{
//                           background: style.bg,
//                           color: style.color,
//                           padding: "6px 12px",
//                           borderRadius: 999,
//                           fontSize: 12,
//                           fontWeight: 500,
//                         }}
//                       >
//                         {step.status}
//                       </span>
//                     </div>

//                     {step.user && (
//                       <div className="text-muted small mb-1">
//                         👤 {step.user}
//                       </div>
//                     )}

//                     {step.remark && (
//                       <div
//                         style={{
//                           marginTop: 8,
//                           background: "#f9fafb",
//                           padding: 10,
//                           borderRadius: 10,
//                           fontSize: 13,
//                         }}
//                       >
//                         “{step.remark}”
//                       </div>
//                     )}

//                     {step.status === "Pending" && (
//                       <div className="text-warning small mt-2">
//                         Waiting for approval from {step.level} team
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // final – POLISHED CARD UI
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ApiServices from "../../../ApiServices";

// export default function TrackExpenses() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     ApiServices.GetSingleExpense({ _id: id })
//       .then((res) => {
//         const result = res?.data?.data;
//         setData(Array.isArray(result) ? result[0] : result);
//         setLoading(false);
//       })
//       .catch(() => {
//         setData(null);
//         setLoading(false);
//       });
//   }, [id]);

//   if (!id) return null;

//   /* 🔹 TEMP approval cards (backend ready future-proof) */
//   const approvalCards = [
//     {
//       level: "CLM",
//       status: "Approved",
//       user: "CLM Team",
//       remark: "Approved as per budget",
//     },
//     {
//       level: "ZH",
//       status: data?.currentStatus || "Pending",
//     },
//   ];

//   const statusStyle = {
//     Approved: {
//       bg: "#DCFCE7",
//       color: "#16A34A",
//       dot: "#22C55E",
//     },
//     Pending: {
//       bg: "#FEF3C7",
//       color: "#D97706",
//       dot: "#FACC15",
//     },
//     Rejected: {
//       bg: "#FEE2E2",
//       color: "#DC2626",
//       dot: "#EF4444",
//     },
//     Hold: {
//       bg: "#E0E7FF",
//       color: "#4338CA",
//       dot: "#3B82F6",
//     },
//   };

//   return (
//     <div style={overlayStyle}>
//       <div style={modalStyle}>
//         {/* HEADER */}
//         <div style={headerStyle}>
//           <h5 style={{ margin: 0 }}>Track Expense Approval</h5>
//           <button onClick={() => navigate(-1)} style={closeBtnStyle}>
//             ✕
//           </button>
//         </div>

//         {loading && <p>Loading...</p>}

//         {!loading && data && (
//           <>
//             {/* SUMMARY */}
//             <div style={summaryBox}>
//               <div style={{ fontWeight: 600 }}>
//                 {data.expenseHeadId?.name}
//               </div>
//               <div style={summaryMeta}>
//                 ₹ {data.amount} • {data.natureOfExpense} •{" "}
//                 {new Date(data.createdAt).toLocaleDateString()}
//               </div>
//             </div>

//             <div style={sectionTitle}>APPROVAL JOURNEY</div>

//             {/* CARDS */}
//             {approvalCards.map((step, index) => {
//               const style =
//                 statusStyle[step.status] || statusStyle.Pending;

//               return (
//                 <div key={index} style={rowStyle}>
//                   {/* TIMELINE */}
//                   <div style={timelineStyle}>
//                     <span
//                       style={{
//                         ...dotStyle,
//                         background: style.dot,
//                       }}
//                     />
//                     {index !== approvalCards.length - 1 && (
//                       <span style={lineStyle} />
//                     )}
//                   </div>

//                   {/* CARD */}
//                   <div
//                     style={{
//                       ...cardStyle,
//                       ...(step.status === "Pending"
//                         ? pendingCard
//                         : {}),
//                     }}
//                   >
//                     <div style={cardHeader}>
//                       <div>
//                         <div style={cardTitle}>{step.level}</div>
//                         <div style={cardSub}>Approval Level</div>
//                       </div>

//                       <span
//                         style={{
//                           ...badgeStyle,
//                           background: style.bg,
//                           color: style.color,
//                         }}
//                       >
//                         {step.status}
//                       </span>
//                     </div>

//                     {step.user && (
//                       <div style={metaText}>
//                         👤 {step.user}
//                       </div>
//                     )}

//                     {step.remark && (
//                       <div style={remarkBox}>
//                         “{step.remark}”
//                       </div>
//                     )}

//                     {step.status === "Pending" && (
//                       <div style={pendingText}>
//                         Waiting for approval from {step.level} team
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const overlayStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.45)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 999,
// };

// const modalStyle = {
//   background: "#fff",
//   borderRadius: 18,
//   padding: 22,
//   width: 540,
//   maxHeight: "90vh",
//   overflowY: "auto",
// };

// const headerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 14,
// };

// const closeBtnStyle = {
//   border: "none",
//   background: "#6B7280",
//   color: "#fff",
//   borderRadius: 6,
//   padding: "4px 8px",
//   cursor: "pointer",
// };

// const summaryBox = {
//   background: "#F9FAFB",
//   borderRadius: 14,
//   padding: 14,
//   marginBottom: 18,
// };

// const summaryMeta = {
//   fontSize: 13,
//   color: "#6B7280",
// };

// const sectionTitle = {
//   fontSize: 13,
//   color: "#6B7280",
//   fontWeight: 600,
//   marginBottom: 12,
// };

// const rowStyle = {
//   display: "flex",
//   gap: 16,
//   marginBottom: 22,
// };

// const timelineStyle = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
// };

// const dotStyle = {
//   width: 14,
//   height: 14,
//   borderRadius: "50%",
// };

// const lineStyle = {
//   width: 2,
//   height: 60,
//   background: "#E5E7EB",
// };

// const cardStyle = {
//   flex: 1,
//   background: "#fff",
//   borderRadius: 16,
//   padding: 16,
//   border: "1px solid #E5E7EB",
// };

// const pendingCard = {
//   background: "#FFFBEB",
//   border: "1px dashed #FACC15",
// };

// const cardHeader = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 6,
// };

// const cardTitle = {
//   fontWeight: 600,
//   fontSize: 15,
// };

// const cardSub = {
//   fontSize: 12,
//   color: "#6B7280",
// };

// const badgeStyle = {
//   fontSize: 12,
//   fontWeight: 500,
//   padding: "4px 12px",
//   borderRadius: 999,
//   whiteSpace: "nowrap",
// };

// const metaText = {
//   fontSize: 12,
//   color: "#6B7280",
//   marginBottom: 6,
// };

// const remarkBox = {
//   background: "#F9FAFB",
//   borderRadius: 10,
//   padding: 10,
//   fontSize: 13,
// };

// const pendingText = {
//   marginTop: 8,
//   fontSize: 13,
//   color: "#92400E",
// };

// // FINAL – STABLE & POLISHED (BACKEND SAFE)
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ApiServices from "../../../ApiServices";

// export default function TrackExpenses() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     ApiServices.GetSingleExpense({ _id: id })
//       .then((res) => {
//         const result = res?.data?.data;
//         setData(Array.isArray(result) ? result[0] : result);
//         setLoading(false);
//       })
//       .catch(() => {
//         setData(null);
//         setLoading(false);
//       });
//   }, [id]);

//   if (!id) return null;

//   /* 🔹 SAFE GUARD (never blank page) */
//   if (loading) {
//     return (
//       <div style={{ padding: 40 }}>
//         <h6>Loading expense details…</h6>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div style={{ padding: 40 }}>
//         <h6>No data found</h6>
//       </div>
//     );
//   }

//   /* 🔹 Approval flow (backend ready) */
//   const approvalCards = [
//     {
//       level: "CLM",
//       status: "Approved",
//       user: "CLM Team",
//       remark: "Approved as per budget",
//     },
//     {
//       level: "ZH",
//       status: data.currentStatus || "Pending",
//     },
//   ];

//   const statusStyle = {
//     Approved: { bg: "#DCFCE7", color: "#16A34A", dot: "#22C55E" },
//     Pending: { bg: "#FEF3C7", color: "#D97706", dot: "#FACC15" },
//     Rejected: { bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" },
//     Hold: { bg: "#E0E7FF", color: "#4338CA", dot: "#3B82F6" },
//   };

//   return (
//     <div style={overlayStyle}>
//       <div style={modalStyle}>
//         {/* HEADER */}
//         <div style={headerStyle}>
//           <h5 style={{ margin: 0 }}>Track Expense Approval</h5>
//           <button onClick={() => navigate(-1)} style={closeBtnStyle}>
//             ✕
//           </button>
//         </div>

//         {/* SUMMARY */}
//         <div style={summaryBox}>
//           <div style={{ fontWeight: 600 }}>
//             {data.expenseHeadId?.name || "—"}
//           </div>
//           <div style={summaryMeta}>
//             ₹ {data.amount} • {data.natureOfExpense} •{" "}
//             {new Date(data.createdAt).toLocaleDateString()}
//           </div>
//         </div>

//         <div style={sectionTitle}>APPROVAL JOURNEY</div>

//         {/* TIMELINE + CARDS */}
//         {approvalCards.map((step, index) => {
//           const style =
//             statusStyle[step.status] || statusStyle.Pending;

//           return (
//             <div key={index} style={rowStyle}>
//               {/* TIMELINE */}
//               <div style={timelineStyle}>
//                 <span
//                   style={{
//                     ...dotStyle,
//                     background: style.dot,
//                   }}
//                 />
//                 {index !== approvalCards.length - 1 && (
//                   <span style={lineStyle} />
//                 )}
//               </div>

//               {/* CARD */}
//               <div
//                 style={{
//                   ...cardStyle,
//                   ...(step.status === "Pending"
//                     ? pendingCard
//                     : {}),
//                 }}
//               >
//                 <div style={cardHeader}>
//                   <div>
//                     <div style={cardTitle}>{step.level}</div>
//                     <div style={cardSub}>Approval Level</div>
//                   </div>

//                   <span
//                     style={{
//                       ...badgeStyle,
//                       background: style.bg,
//                       color: style.color,
//                     }}
//                   >
//                     {step.status}
//                   </span>
//                 </div>

//                 {step.user && (
//                   <div style={metaText}>
//                     👤 {step.user}
//                   </div>
//                 )}

//                 {step.remark && (
//                   <div style={remarkBox}>
//                     “{step.remark}”
//                   </div>
//                 )}

//                 {step.status === "Pending" && (
//                   <div style={pendingText}>
//                     Waiting for approval from {step.level} team
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const overlayStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.45)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 999,
// };

// const modalStyle = {
//   background: "#fff",
//   borderRadius: 18,
//   padding: 22,
//   width: 540,
//   maxHeight: "90vh",
//   overflowY: "auto",
// };

// const headerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 14,
// };

// const closeBtnStyle = {
//   border: "none",
//   background: "#6B7280",
//   color: "#fff",
//   borderRadius: 6,
//   padding: "4px 8px",
//   cursor: "pointer",
// };

// const summaryBox = {
//   background: "#F9FAFB",
//   borderRadius: 14,
//   padding: 14,
//   marginBottom: 18,
// };

// const summaryMeta = {
//   fontSize: 13,
//   color: "#6B7280",
// };

// const sectionTitle = {
//   fontSize: 13,
//   color: "#6B7280",
//   fontWeight: 600,
//   marginBottom: 12,
// };

// const rowStyle = {
//   display: "flex",
//   gap: 16,
//   marginBottom: 22,
// };

// const timelineStyle = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
// };

// const dotStyle = {
//   width: 14,
//   height: 14,
//   borderRadius: "50%",
// };

// const lineStyle = {
//   width: 2,
//   height: 50,
//   background: "#E5E7EB",
// };

// const cardStyle = {
//   flex: 1,
//   background: "#fff",
//   borderRadius: 16,
//   padding: 16,
//   border: "1px solid #E5E7EB",
// };

// const pendingCard = {
//   background: "#FFFBEB",
//   border: "1px dashed #FACC15",
// };

// const cardHeader = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 6,
// };

// const cardTitle = {
//   fontWeight: 600,
//   fontSize: 15,
// };

// const cardSub = {
//   fontSize: 12,
//   color: "#6B7280",
// };

// const badgeStyle = {
//   fontSize: 12,
//   fontWeight: 500,
//   padding: "4px 12px",
//   borderRadius: 999,
//   whiteSpace: "nowrap",
// };

// const metaText = {
//   fontSize: 12,
//   color: "#6B7280",
//   marginBottom: 6,
// };

// const remarkBox = {
//   background: "#F9FAFB",
//   borderRadius: 10,
//   padding: 10,
//   fontSize: 13,
// };

// const pendingText = {
//   marginTop: 8,
//   fontSize: 13,
//   color: "#92400E",
// };

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ApiServices from "../../../ApiServices";

// export default function TrackExpenses() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     ApiServices.GetSingleExpense({ _id: id })
//       .then((res) => {
//         const result = res?.data?.data;
//         setData(Array.isArray(result) ? result[0] : result);
//         setLoading(false);
//       })
//       .catch(() => {
//         setData(null);
//         setLoading(false);
//       });
//   }, [id]);

//   if (!id) return null;

//   const approvalCards = [
//     {
//       level: "CLM",
//       status: "Approved",
//       user: "CLM Team",
//       remark: "Approved as per budget",
//     },
//     {
//       level: "ZH",
//       status: data?.currentStatus || "Pending",
//     },
//   ];

//   const STATUS = {
//     Approved: { bg: "#DCFCE7", color: "#16A34A", dot: "#22C55E" },
//     Pending: { bg: "#FEF3C7", color: "#D97706", dot: "#FACC15" },
//     Rejected: { bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" },
//     Hold: { bg: "#E0E7FF", color: "#4338CA", dot: "#3B82F6" },
//   };

//   return (
//     <div style={overlay}>
//       <div style={modal}>
//         {/* HEADER */}
//         <div style={header}>
//           <h5 style={{ margin: 0 }}>Track Expense Approval</h5>
//           <button style={closeBtn} onClick={() => navigate(-1)}>✕</button>
//         </div>

//         {loading && <p>Loading...</p>}

//         {!loading && data && (
//           <>
//             {/* SUMMARY */}
//             <div style={summary}>
//               <div style={{ fontWeight: 600 }}>
//                 {data.expenseHeadId?.name}
//               </div>
//               <div style={summaryMeta}>
//                 ₹ {data.amount} • {data.natureOfExpense} •{" "}
//                 {new Date(data.createdAt).toLocaleDateString()}
//               </div>
//             </div>

//             <div style={sectionTitle}>APPROVAL JOURNEY</div>

//             {approvalCards.map((step, index) => {
//               const style = STATUS[step.status] || STATUS.Pending;

//               return (
//                 <div key={index} style={row}>
//                   {/* TIMELINE (ABSOLUTE – FIXED) */}
//                   <div style={timelineContainer}>
//                     <span
//                       style={{
//                         ...dot,
//                         background: style.dot,
//                         top: 24, // 🔥 header center
//                       }}
//                     />
//                     {index !== approvalCards.length - 1 && (
//                       <span style={line} />
//                     )}
//                   </div>

//                   {/* CARD */}
//                   <div
//                     style={{
//                       ...card,
//                       ...(step.status === "Pending" ? pendingCard : {}),
//                     }}
//                   >
//                     <div style={cardHeader}>
//                       <div>
//                         <div style={cardTitle}>{step.level}</div>
//                         <div style={cardSub}>Approval Level</div>
//                       </div>

//                       <span
//                         style={{
//                           ...badge,
//                           background: style.bg,
//                           color: style.color,
//                         }}
//                       >
//                         {step.status}
//                       </span>
//                     </div>

//                     {step.user && (
//                       <div style={meta}>👤 {step.user}</div>
//                     )}

//                     {step.remark && (
//                       <div style={remark}>“{step.remark}”</div>
//                     )}

//                     {step.status === "Pending" && (
//                       <div style={pendingText}>
//                         Waiting for approval from {step.level} team
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ===================== STYLES ===================== */

// const overlay = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.45)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 999,
// };

// const modal = {
//   background: "#fff",
//   borderRadius: 20,
//   padding: 22,
//   width: 560,
//   maxHeight: "90vh",
//   overflowY: "auto",
// };

// const header = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 14,
// };

// const closeBtn = {
//   border: "none",
//   background: "#6B7280",
//   color: "#fff",
//   borderRadius: 8,
//   padding: "4px 10px",
//   cursor: "pointer",
// };

// const summary = {
//   background: "#F9FAFB",
//   borderRadius: 14,
//   padding: 14,
//   marginBottom: 18,
// };

// const summaryMeta = {
//   fontSize: 13,
//   color: "#6B7280",
// };

// const sectionTitle = {
//   fontSize: 13,
//   color: "#6B7280",
//   fontWeight: 600,
//   marginBottom: 12,
// };

// const row = {
//   display: "flex",
//   gap: 24,
//   position: "relative", // 🔥 IMPORTANT
//   marginBottom: 28,
// };

// const timelineContainer = {
//   width: 24,
//   position: "relative",
// };

// const dot = {
//   width: 15,
//   height: 15,
//   borderRadius: "50%",
//   position: "absolute",
//   left: "50%",
//   transform: "translateX(-50%)",
// };

// const line = {
//   position: "absolute",
//   top: 38,
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: 5,
//   height: "110%",
//   background: "#E5E7EB",
// };

// const card = {
//   flex: 1,
//   background: "#fff",
//   borderRadius: 16,
//   padding: 16,
//   border: "1px solid #E5E7EB",
// };

// const pendingCard = {
//   background: "#FFFBEB",
//   border: "1px dashed #FACC15",
// };

// const cardHeader = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 6,
// };

// const cardTitle = {
//   fontWeight: 600,
//   fontSize: 15,
// };

// const cardSub = {
//   fontSize: 12,
//   color: "#6B7280",
// };

// const badge = {
//   fontSize: 12,
//   fontWeight: 500,
//   padding: "4px 12px",
//   borderRadius: 999,
//   whiteSpace: "nowrap",
// };

// const meta = {
//   fontSize: 12,
//   color: "#6B7280",
//   marginBottom: 6,
// };

// const remark = {
//   background: "#F9FAFB",
//   borderRadius: 10,
//   padding: 10,
//   fontSize: 13,
// };

// const pendingText = {
//   marginTop: 8,
//   fontSize: 13,
//   color: "#92400E",
// };

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ApiServices from "../../../ApiServices";

// export default function TrackExpenses() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     ApiServices.GetSingleExpense({ _id: id })
//       .then((res) => {
//         const result = res?.data?.data;
//         setData(Array.isArray(result) ? result[0] : result);
//         setLoading(false);
//       })
//       .catch(() => {
//         setData(null);
//         setLoading(false);
//       });
//   }, [id]);

//   if (!id) return null;

//   /* ================= APPROVAL FLOW ================= */
//   const approvalCards = [
//     {
//       level: "CLM",
//       status: "Approved",
//       user: "CLM Team",
//     },
//     {
//       level: "ZH",
//       status: data?.currentStatus || "Pending",
//       remark:
//         data?.currentStatus === "Hold" || data?.currentStatus === "Rejected"
//           ? data?.remark
//           : "",
//     },
//   ];

//   const STATUS = {
//     Approved: { bg: "#DCFCE7", color: "#16A34A", dot: "#22C55E" },
//     Pending: { bg: "#FEF3C7", color: "#D97706", dot: "#FACC15" },
//     Rejected: { bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" },
//     Hold: { bg: "#E0E7FF", color: "#4338CA", dot: "#3B82F6" },
//   };

//   return (
//     <div style={overlay}>
//       <div style={modal}>
//         {/* HEADER */}
//         <div style={header}>
//           <h5 style={{ margin: 0 }}>Track Expense Approval</h5>
//           <button style={closeBtn} onClick={() => navigate(-1)}>
//             ✕
//           </button>
//         </div>

//         {loading && <p>Loading...</p>}

//         {!loading && data && (
//           <>
//             {/* SUMMARY */}
//             <div style={summary}>
//               <div style={{ fontWeight: 600 }}>{data.expenseHeadId?.name}</div>
//               <div style={summaryMeta}>
//                 ₹ {data.amount} • {data.natureOfExpense} •{" "}
//                 {new Date(data.createdAt).toLocaleDateString()}
//               </div>
//             </div>

//             <div style={sectionTitle}>APPROVAL JOURNEY</div>

//             {approvalCards.map((step, index) => {
//               const style = STATUS[step.status] || STATUS.Pending;

//               return (
//                 <div key={index} style={row}>
//                   {/* TIMELINE */}
//                   <div style={timelineContainer}>
//                     <span
//                       style={{
//                         ...dot,
//                         background: style.dot,
//                         top: 22,
//                       }}
//                     />
//                     {index !== approvalCards.length - 1 && <span style={line} />}
//                   </div>

//                   {/* CARD */}
//                   <div
//                     style={{
//                       ...card,
//                       ...(step.status === "Pending" ? pendingCard : {}),
//                     }}
//                   >
//                     <div style={cardHeader}>
//                       <div>
//                         <div style={cardTitle}>{step.level}</div>
//                         <div style={cardSub}>Approval Level</div>
//                       </div>

//                       <span
//                         style={{
//                           ...badge,
//                           background: style.bg,
//                           color: style.color,
//                         }}
//                       >
//                         {step.status}
//                       </span>
//                     </div>

//                     {step.user && <div style={meta}>👤 {step.user}</div>}

//                     {/* REMARK */}
//                     {step.remark &&
//                       (step.status === "Hold" || step.status === "Rejected") && (
//                         <div
//                           style={{
//                             ...remark,
//                             background:
//                               step.status === "Rejected" ? "#FEE2E2" : "#EEF2FF",
//                           }}
//                         >
//                           “{step.remark}”
//                         </div>
//                       )}

//                     {/* PENDING TEXT */}
//                     {step.status === "Pending" && (
//                       <div style={pendingText}>
//                         Waiting for approval from {step.level} team
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ===================== STYLES ===================== */

// const overlay = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.45)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 999,
//   padding: 16, // mobile spacing
// };

// const modal = {
//   background: "#fff",
//   borderRadius: 20,
//   padding: 20,
//   width: "100%",       // responsive width
//   maxWidth: 560,       // desktop max
//   maxHeight: "90vh",
//   overflowY: "auto",
//   boxSizing: "border-box",
// };

// const header = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 14,
// };

// const closeBtn = {
//   border: "none",
//   background: "#ef3939",
//   color: "#fff",
//   borderRadius: 8,
//   padding: "4px 8px",
//   fontSize: 14,
//   cursor: "pointer",
// };

// const summary = {
//   background: "#F9FAFB",
//   borderRadius: 14,
//   padding: 12,
//   marginBottom: 18,
// };

// const summaryMeta = {
//   fontSize: 13,
//   color: "#6B7280",
// };

// const sectionTitle = {
//   fontSize: 13,
//   color: "#6B7280",
//   fontWeight: 600,
//   marginBottom: 12,
// };

// const row = {
//   display: "flex",
//   flexDirection: "row",
//   gap: 16,
//   position: "relative",
//   marginBottom: 24,
//   flexWrap: "wrap", // allows wrapping on small screens
// };

// const timelineContainer = {
//   width: 24,
//   position: "relative",
//   flexShrink: 0,
// };

// const dot = {
//   width: 14,
//   height: 14,
//   borderRadius: "50%",
//   position: "absolute",
//   left: "50%",
//   transform: "translateX(-50%)",
// };

// const line = {
//   position: "absolute",
//   top: 36,
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: 4,
//   height: "120%",
//   background: "#E5E7EB",
// };

// const card = {
//   flex: 1,
//   minWidth: 200,       // responsive minimum width
//   background: "#fff",
//   borderRadius: 16,
//   padding: 16,
//   border: "1px solid #E5E7EB",
//   wordBreak: "break-word",
// };

// const pendingCard = {
//   background: "#FFFBEB",
//   border: "1px dashed #FACC15",
// };

// const cardHeader = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 6,
//   flexWrap: "wrap", // wrap badge on small screens
// };

// const cardTitle = {
//   fontWeight: 600,
//   fontSize: 15,
// };

// const cardSub = {
//   fontSize: 12,
//   color: "#6B7280",
// };

// const badge = {
//   fontSize: 12,
//   fontWeight: 500,
//   padding: "4px 8px",
//   borderRadius: 999,
//   whiteSpace: "nowrap",
//   marginTop: 4,
// };

// const meta = {
//   fontSize: 12,
//   color: "#6B7280",
//   marginBottom: 6,
// };

// const remark = {
//   borderRadius: 10,
//   padding: 10,
//   fontSize: 13,
// };

// const pendingText = {
//   marginTop: 8,
//   fontSize: 13,
//   color: "#92400E",
// };

// 27 jan
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiServices from "../../../ApiServices";

export default function TrackExpenses() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    ApiServices.GetSingleExpense({ _id: id })
      .then((res) => {
        const result = res?.data?.data;
        setData(Array.isArray(result) ? result[0] : result);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return null;
  if (!data) return null;

  /* ================= APPROVAL LEVELS (SAFE LOGIC) ================= */

  // 🔥 backend already decides this, frontend just reflects
  let approvalLevels = [];

  if (data.amount <= 5000) {
    approvalLevels = ["CLM"];
  } else if (data.amount <= 10000) {
    approvalLevels = ["ZONAL_HEAD"];
  } else {
    approvalLevels = ["ZONAL_HEAD", "BUSINESS_FINANCE", "PROCUREMENT"];
  }

  const approvalCards = approvalLevels.map((level) => {
    let status = "Pending";
    let remark = "";

    if (data.currentStatus === "Approved") {
      status = "Approved";
    }

    if (data.currentStatus === "Hold" || data.currentStatus === "Rejected") {
      if (data.actionBy === level) {
        status = data.currentStatus;
        remark = data.remark || "";
      } else if (
        approvalLevels.indexOf(level) < approvalLevels.indexOf(data.actionBy)
      ) {
        status = "Approved";
      }
    }

    return { level, status, remark };
  });

  const STATUS = {
    Approved: { bg: "#DCFCE7", color: "#16A34A", dot: "#22C55E" },
    Pending: { bg: "#FEF3C7", color: "#D97706", dot: "#FACC15" },
    Rejected: { bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" },
    Hold: { bg: "#E0E7FF", color: "#4338CA", dot: "#3B82F6" },
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h5 style={{ margin: 0 }}>Track Expense Approval</h5>
          <button style={closeBtn} onClick={() => navigate(-1)}>
            ✕
          </button>
        </div>

        <div style={summary}>
          <div style={{ fontWeight: 600 }}>{data.expenseHeadId?.name}</div>
          <div style={summaryMeta}>
            ₹ {data.amount} • {data.natureOfExpense} •{" "}
            {new Date(data.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div style={sectionTitle}>APPROVAL JOURNEY</div>

        {approvalCards.map((step, index) => {
          const style = STATUS[step.status];

          return (
            <div key={index} style={row}>
              <div style={timelineContainer}>
                <span style={{ ...dot, background: style.dot, top: 22 }} />
                {index !== approvalCards.length - 1 && <span style={line} />}
              </div>

              <div
                style={{
                  ...card,
                  ...(step.status === "Pending" ? pendingCard : {}),
                }}
              >
                <div style={cardHeader}>
                  <div>
                    <div style={cardTitle}>{step.level}</div>
                    <div style={cardSub}>Approval Level</div>
                  </div>
                  <span
                    style={{
                      ...badge,
                      background: style.bg,
                      color: style.color,
                    }}
                  >
                    {step.status}
                  </span>
                </div>

                {(step.status === "Hold" || step.status === "Rejected") &&
                  step.remark && <div style={remark}>“{step.remark}”</div>}

                {step.status === "Pending" && (
                  <div style={pendingText}>
                    Waiting for approval from {step.level} team
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  background: "#fff",
  borderRadius: 20,
  padding: 20,
  width: "100%",
  maxWidth: 560,
  maxHeight: "90vh",
  overflowY: "auto",
};

const header = { display: "flex", justifyContent: "space-between" };
const closeBtn = { background: "#ef3939", color: "#fff", border: "none" };
const summary = { background: "#F9FAFB", padding: 12, borderRadius: 12 };
const summaryMeta = { fontSize: 13, color: "#6B7280" };
const sectionTitle = { fontSize: 13, margin: "12px 0" };
const row = { display: "flex", gap: 16, marginBottom: 24 };
const timelineContainer = { width: 24, position: "relative" };
const dot = {
  width: 14,
  height: 14,
  borderRadius: "50%",
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
};
const line = {
  position: "absolute",
  top: 36,
  left: "50%",
  width: 4,
  height: "120%",
  background: "#E5E7EB",
  transform: "translateX(-50%)",
};
const card = {
  flex: 1,
  border: "1px solid #E5E7EB",
  borderRadius: 16,
  padding: 16,
};
const badge = {
  padding: "2px 10px", 
  borderRadius: 999,
  fontSize: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 22,
  lineHeight: 1,
};
const pendingCard = { background: "#FFFBEB", border: "1px dashed #FACC15" };
const cardHeader = { display: "flex", justifyContent: "space-between" };
const cardTitle = { fontWeight: 600 };
const cardSub = { fontSize: 12, color: "#6B7280" };
const remark = {
  marginTop: 8,
  padding: 10,
  borderRadius: 10,
  background: "#F9FAFB",
};
const pendingText = { marginTop: 8, color: "#92400E" };
