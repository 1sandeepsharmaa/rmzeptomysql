// const Base_URL = "http://localhost:3000/";

// export default function ExpenseTimeline({ expense, approvalHistory }) {
//     if (!expense) return null;

//     const timeline = [];

//     const fileUrl = (path) =>
//         path ? Base_URL + path : null;

//     /* ================= ORIGINAL ================= */
//     if (expense.attachment) {
//         timeline.push({
//             type: "ORIGINAL",
//             attachment: expense.attachment,
//             prAttachment: null,
//             poAttachment: null,
//             date: expense.createdAt,
//         });
//     }

//     /* ================= APPROVAL HISTORY ================= */
//     (approvalHistory || []).forEach((item) => {
//         const actionType = item.action?.toUpperCase();

//         const normalizedLevel =
//             item.level?.replace(/\s+/g, "").toUpperCase();

//         const isPrPoApproved =
//             normalizedLevel === "PR/PO" && actionType === "APPROVED";

//         timeline.push({
//             type: actionType,
//             level: item.level,
//             comment: item.comment,

//             // ✅ Attachments only when PR/PO APPROVED
//             prAttachment: isPrPoApproved ? expense.prAttachment : null,
//             poAttachment: isPrPoApproved ? expense.poAttachment : null,

//             date: item.actionAt,
//         });
//     });


//     /* ================= RESUBMISSIONS ================= */
//     (expense.resubmissions || []).forEach((resub) => {
//         timeline.push({
//             type: "RESUBMITTED",
//             attachment: resub.attachment,
//             comment: resub.fmComment,
//             level: resub.heldFromLevel,
//             date: resub.submittedAt,
//         });
//     });

//     /* ================= EXECUTION ================= */
//     if (expense.wcrAttachment || expense.invoiceAttachment) {
//         timeline.push({
//             type: "EXECUTION",
//             wcr: expense.wcrAttachment,
//             invoice: expense.invoiceAttachment,
//             date: expense.executionUploadedAt || expense.updatedAt,
//         });
//     }

//     /* ================= SORT BY DATE ================= */
//     timeline.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

//     return (
//         <div className="col-12 mt-4">
//             <h5 className="text-primary">Approval Timeline</h5>

//             {timeline.map((item, index) => (
//                 <div
//                     key={index}
//                     className="p-3 mb-3 rounded shadow-sm bg-white border-start border-4 border-primary"
//                 >
//                     {/* ================= ORIGINAL ================= */}
//                     {item.type === "ORIGINAL" && (
//                         <>
//                             <h6 className="text-primary">Original Expense Submitted</h6>
//                             <a
//                                 href={fileUrl(item.attachment)}
//                                 target="_blank"
//                                 rel="noreferrer"
//                                 className="btn btn-sm btn-primary"
//                             >
//                                 View Original Attachment
//                             </a>
//                         </>
//                     )}

//                     {/* ================= APPROVAL ACTIONS ================= */}
//                     {["APPROVED", "REJECTED", "HOLD", "CLOSED"].includes(
//                         item.type
//                     ) && (
//                             <>
//                                 <h6 className="mb-2">
//                                     {item.level} {item.type}
//                                 </h6>

//                                 <p>
//                                     <strong>
//                                         {item.type === "CLOSED" && item.level === "PR/PO"
//                                             ? "Email Subject:"
//                                             : item.type === "CLOSED" &&
//                                                 item.level === "ZONAL_COMMERCIAL"
//                                                 ? "Prism ID:"
//                                                 : "Comment:"}
//                                     </strong>{" "}
//                                     {item.comment || "-"}
//                                 </p>

//                                 {/* PR Attachment */}
//                                 {item.prAttachment && (
//                                     <a
//                                         href={fileUrl(item.prAttachment)}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                         className="btn btn-sm btn-info me-2"
//                                     >
//                                         View PR Attachment
//                                     </a>
//                                 )}

//                                 {/* PO Attachment */}
//                                 {item.poAttachment && (
//                                     <a
//                                         href={fileUrl(item.poAttachment)}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                         className="btn btn-sm btn-secondary"
//                                     >
//                                         View PO Attachment
//                                     </a>
//                                 )}
//                             </>
//                         )}

//                     {/* ================= RESUBMITTED ================= */}
//                     {item.type === "RESUBMITTED" && (
//                         <>
//                             <h6 className="text-warning">
//                                 {item.level} RESUBMITTED
//                             </h6>

//                             <p>
//                                 <strong>Comment:</strong> {item.comment || "-"}
//                             </p>

//                             {item.attachment && (
//                                 <a
//                                     href={fileUrl(item.attachment)}
//                                     target="_blank"
//                                     rel="noreferrer"
//                                     className="btn btn-sm btn-warning text-dark"
//                                 >
//                                     View Resubmitted Attachment
//                                 </a>
//                             )}
//                         </>
//                     )}

//                     {/* ================= EXECUTION ================= */}
//                     {item.type === "EXECUTION" && (
//                         <>
//                             <h6 className="text-info">
//                                 FM Uploaded Execution Documents
//                             </h6>

//                             {item.wcr && (
//                                 <a
//                                     href={fileUrl(item.wcr)}
//                                     target="_blank"
//                                     rel="noreferrer"
//                                     className="btn btn-sm btn-info me-2"
//                                 >
//                                     WCR
//                                 </a>
//                             )}

//                             {item.invoice && (
//                                 <a
//                                     href={fileUrl(item.invoice)}
//                                     target="_blank"
//                                     rel="noreferrer"
//                                     className="btn btn-sm btn-secondary"
//                                 >
//                                     Invoice
//                                 </a>
//                             )}
//                         </>
//                     )}

//                     {/* ================= DATE ================= */}
//                     <div className="text-muted mt-2" style={{ fontSize: "12px" }}>
//                         {new Date(item.date).toLocaleString()}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }


const Base_URL = "http://localhost:3000/";

export default function ExpenseTimeline({ expense, approvalHistory }) {
    if (!expense) return null;

    const timeline = [];

    const fileUrl = (path) => (path ? Base_URL + path : null);

    /* ================= ORIGINAL ================= */
    if (expense.attachment) {
        const normalizedAttachments = Array.isArray(expense.attachment)
            ? expense.attachment
            : [expense.attachment]; // convert string to array

        timeline.push({
            type: "ORIGINAL",
            attachments: normalizedAttachments,
            submittedBy: expense?.raisedBy,
            date: expense.createdAt,
        });
    }


    /* ================= APPROVAL HISTORY ================= */
    (approvalHistory || []).forEach((item) => {
        const actionType = item.action?.toUpperCase();

        const normalizedLevel =
            item.level?.replace(/\s+/g, "").toUpperCase();

        const isPrPoApproved =
            normalizedLevel === "PR/PO" && actionType === "APPROVED";

        timeline.push({
            type: actionType,
            level: item.level,
            comment: item.comment,
            approver: item?.approverId,
            prAttachment: isPrPoApproved ? expense.prAttachment : null,
            poAttachment: isPrPoApproved ? expense.poAttachment : null,
            date: item.actionAt,
        });
    });

    /* ================= RESUBMISSIONS ================= */
    (expense.resubmissions || []).forEach((resub) => {
        timeline.push({
            type: "RESUBMITTED",
            attachments: resub.attachment || [],
            comment: resub.fmComment,
            level: resub.heldFromLevel,
            date: resub.submittedAt,
        });
    });

    /* ================= EXECUTION ================= */
    if (expense.wcrAttachment || expense.invoiceAttachment) {
        timeline.push({
            type: "EXECUTION",
            wcr: expense.wcrAttachment,
            invoice: expense.invoiceAttachment,
            date: expense.executionUploadedAt || expense.updatedAt,
        });
    }

    /* ================= SORT ================= */
    timeline.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

    return (
        <div className="col-12 mt-4">
            <h5 className="text-primary mb-3">Approval Timeline</h5>

            {timeline.map((item, index) => (
                <div
                    key={index}
                    className="card mb-3 shadow-sm border-0"
                    style={{ borderLeft: "4px solid #6776f4" }}
                >
                    <div className="card-body">

                        {/* ================= ORIGINAL ================= */}
                        {item.type === "ORIGINAL" && (
                            <>
                                <div className="d-flex flex-column flex-md-row justify-content-between mt-3">
                                    <div>
                                        <h6 className="text-primary mb-1">
                                            Expense Submitted by {item.submittedBy?.name || "-"}
                                        </h6>
                                        <small className="text-muted">
                                            {item.submittedBy?.designation || ""}
                                        </small>
                                    </div>
                                </div>

                                <div className="mt-3 d-flex flex-wrap gap-2">
                                    {Array.isArray(item.attachments) && item.attachments.length > 0 ? (
                                        item.attachments.map((file, i) => (
                                            <a
                                                key={i}
                                                href={fileUrl(file)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-sm btn-primary"
                                            >
                                                Attachment {i + 1}
                                            </a>
                                        ))
                                    ) : (
                                        <span className="text-muted">No Attachment</span>
                                    )}
                                </div>
                            </>
                        )}


                        {/* ================= APPROVAL ACTIONS ================= */}
                        {["APPROVED", "REJECTED", "HOLD", "CLOSED"].includes(
                            item.type
                        ) && (
                                <>
                                    <div className="d-flex flex-column flex-md-row justify-content-between mt-3">
                                        <div>
                                            <h6 className="mb-1">
                                                {item.level} {item.type}
                                            </h6>
                                            <small className="text-muted">
                                                {item.approver?.name}{" "}
                                                {item.approver?.designation &&
                                                    `(${item.approver?.designation})`}
                                            </small>
                                        </div>
                                    </div>

                                    <p className="mt-2 mb-2">
                                        <strong>Comment:</strong>{" "}
                                        {item.comment || "-"}
                                    </p>

                                    <div className="d-flex flex-wrap gap-2">
                                        {item.prAttachment && (
                                            <a
                                                href={fileUrl(item.prAttachment)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-sm btn-info"
                                            >
                                                PR Attachment
                                            </a>
                                        )}

                                        {item.poAttachment && (
                                            <a
                                                href={fileUrl(item.poAttachment)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-sm btn-secondary"
                                            >
                                                PO Attachment
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}

                        {/* ================= RESUBMITTED ================= */}
                        {item.type === "RESUBMITTED" && (
                            <>
                                <h6 className="text-warning mb-1">
                                    {item.level} RESUBMITTED
                                </h6>

                                <p className="mb-2">
                                    <strong>Comment:</strong>{" "}
                                    {item.comment || "-"}
                                </p>

                                <div className="d-flex flex-wrap gap-2">
                                    {(item.attachments || []).map((file, i) => (
                                        <a
                                            key={i}
                                            href={fileUrl(file)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-sm btn-warning text-dark"
                                        >
                                            Resubmitted {i + 1}
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ================= EXECUTION ================= */}
                        {item.type === "EXECUTION" && (
                            <>
                                <h6 className="text-info mb-2">
                                    FM Uploaded Execution Documents
                                </h6>

                                <div className="d-flex flex-wrap gap-2">
                                    {item.wcr && (
                                        <a
                                            href={fileUrl(item.wcr)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-sm btn-info"
                                        >
                                            WCR
                                        </a>
                                    )}

                                    {item.invoice && (
                                        <a
                                            href={fileUrl(item.invoice)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-sm btn-secondary"
                                        >
                                            Invoice
                                        </a>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ================= DATE ================= */}
                        <div
                            className="text-muted mt-3"
                            style={{ fontSize: "12px" }}
                        >
                            {new Date(item.date).toLocaleString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

