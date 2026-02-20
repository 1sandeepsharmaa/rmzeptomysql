const expenseApprovalModel = require("./expenseApprovalModel");
const expenseModel = require("../Expense/expenseModel");
const approvalPolicyModel = require("../Approval Policy/approvalPolicyModel");
const userModel = require("../User/userModel");
const storeModel = require("../Store/storeModel");
const zhModel = require("../Zonal Head/zonalHeadModel");
const expenseHeadModel = require("../ExpenseHead/expenseHeadModel");
const { Op } = require("sequelize");

/* ================= APPROVE EXPENSE ================= */
const approveExpense = async (req, res) => {
    try {
        const { expenseId, approverId, comment, prComment, poComment } = req.body;

        if (!expenseId || !approverId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId & approverId are required",
            });
        }

        const expense = await expenseModel.findOne({
            where: { id: expenseId }
        });

        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found",
            });
        }

        if (expense.currentStatus !== "Pending") {
            return res.send({
                status: 422,
                success: false,
                message: "Expense is not in pending state",
            });
        }

        const approver = await userModel.findOne({ where: { id: approverId } });
        if (!approver || !approver.designation) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approver",
            });
        }

        const normalize = (v) =>
            v?.toUpperCase().replace(/\s+/g, "").replace(/\//g, "").trim();

        const approverLevel = normalize(approver.designation);
        const expenseLevel = normalize(expense.currentApprovalLevel);

        if (approverLevel !== expenseLevel) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approval flow",
            });
        }

        /* ================= PR/PO UNIVERSAL LOGIC ================= */
        if (expense.currentApprovalLevel === "PR/PO") {

            if (!prComment?.trim() || !poComment?.trim()) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "PR & PO comment are required",
                });
            }

            expense.prComment = prComment.trim();
            expense.poComment = poComment.trim();

            if (req.files?.prAttachment) {
                expense.prAttachment = req.files.prAttachment[0].path;
            }

            if (req.files?.poAttachment) {
                expense.poAttachment = req.files.poAttachment[0].path;
            }
        }

        /* ================= SAVE APPROVAL HISTORY ================= */
        await expenseApprovalModel.create({
            expenseId,
            level: expense.currentApprovalLevel,
            approverId,
            action: "Approved",
            comment:
                expense.currentApprovalLevel === "PR/PO"
                    ? `PR: ${expense.prComment} | PO: ${expense.poComment}`
                    : comment || "",
            actionAt: new Date(),
        });

        /* ================= CAPEX FLOW ================= */
        if (expense.natureOfExpense === "CAPEX") {

            if (expense.currentApprovalLevel === "PR/PO") {
                expense.currentApprovalLevel = "FM";
                expense.currentStatus = "Approved";
                expense.postApprovalStage = "FM_PENDING";
            } else {
                const CAPEX_FLOW = [
                    "ZONAL_HEAD",
                    "BUSINESS_FINANCE",
                    "PROCUREMENT",
                    "PR/PO",
                ];

                const idx = CAPEX_FLOW.map(normalize).indexOf(approverLevel);
                expense.currentApprovalLevel = CAPEX_FLOW[idx + 1];
                expense.currentStatus = "Pending";
            }

            expense.heldFromLevel = null;
            expense.holdComment = "";

            await expense.save();

            return res.send({
                status: 200,
                success: true,
                message: "CAPEX approved",
            });
        }

        /* ================= OPEX FLOW ================= */
        const policy = await approvalPolicyModel.findOne({ where: { id: expense.policyId } });
        const levels = policy?.approvalLevels || [];
        const idx = levels.map(normalize).indexOf(normalize(approverLevel));
        const next = levels[idx + 1];

        if (next) {
            expense.currentApprovalLevel = next;
            expense.currentStatus = "Pending";
        } else {
            expense.currentStatus = "Approved";
            expense.currentApprovalLevel = "FM";
            expense.postApprovalStage = "FM_PENDING";
        }

        expense.heldFromLevel = null;
        expense.holdComment = "";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "Expense approved",
        });

    } catch (err) {
        console.error("Approve Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Approval failed",
        });
    }
};

/* ================= HOLD EXPENSE ================= */
const holdExpense = async (req, res) => {
    try {
        const { expenseId, approverId, comment } = req.body;

        if (!expenseId || !approverId || !comment?.trim()) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, approverId & comment are required",
            });
        }

        const expense = await expenseModel.findOne({ where: { id: expenseId } });
        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found",
            });
        }

        const approver = await userModel.findOne({ where: { id: approverId } });
        if (!approver || !approver.designation) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approver",
            });
        }

        const approverLevel = approver.designation.toUpperCase();

        let prAttachmentUrl = null;
        let poAttachmentUrl = null;

        if (req.files?.prAttachment?.length > 0) {
            prAttachmentUrl = req.files.prAttachment[0].path;
        }

        if (req.files?.poAttachment?.length > 0) {
            poAttachmentUrl = req.files.poAttachment[0].path;
        }

        await expenseApprovalModel.create({
            expenseId: expense.id,
            level: approverLevel,
            approverId,
            comment,
            action: "Hold"
        });

        const newHoldHistory = [...(expense.holdHistory || [])];
        newHoldHistory.push({
            heldBy: approverId,
            level: approverLevel,
            comment: comment.trim(),
            prAttachment: prAttachmentUrl,
            poAttachment: poAttachmentUrl
        });
        expense.holdHistory = newHoldHistory;

        expense.currentStatus = "Hold";
        expense.holdComment = comment.trim();
        expense.heldFromLevel = approverLevel;
        expense.currentApprovalLevel = "FM";
        expense.postApprovalStage = "NONE";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "Expense put on Hold and sent back to FM",
        });

    } catch (err) {
        console.error("Hold Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Hold failed",
        });
    }
};

/* ================= REJECT EXPENSE ================= */
const rejectExpense = async (req, res) => {
    try {
        const { expenseId, approverId, comment } = req.body;

        if (!expenseId || !approverId || !comment?.trim()) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, approverId & comment are required",
            });
        }

        const expense = await expenseModel.findOne({ where: { id: expenseId } });
        if (!expense || !expense.currentApprovalLevel) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid expense or no approval pending",
            });
        }

        await expenseApprovalModel.create({
            expenseId,
            level: expense.currentApprovalLevel,
            approverId,
            comment: comment.trim(),
            action: "Rejected",
            status: "Rejected",
            actionAt: new Date(),
        });

        expense.currentStatus = "Rejected";
        expense.currentApprovalLevel = null;
        expense.postApprovalStage = "CLOSED";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "Expense Rejected",
        });

    } catch (err) {
        console.error("Reject Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Reject failed",
        });
    }
};

const resubmitHeldExpense = async (req, res) => {
    try {
        const { expenseId, fmComment, approverId } = req.body;

        if (!expenseId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId is required"
            });
        }

        if (!fmComment?.trim()) {
            return res.send({
                status: 422,
                success: false,
                message: "FM comment is required"
            });
        }

        const expense = await expenseModel.findOne({ where: { id: expenseId } });

        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found"
            });
        }

        if (expense.currentStatus !== "Hold") {
            return res.send({
                status: 422,
                success: false,
                message: "Expense is not in Hold state"
            });
        }

        if (!req.file) {
            return res.send({
                status: 422,
                success: false,
                message: "Attachment is required for resubmission"
            });
        }

        const uploadedUrl = req.file.path;

        const newResubmissions = [...(expense.resubmissions || [])];
        newResubmissions.push({
            attachment: uploadedUrl,
            fmComment: fmComment.trim(),
            heldFromLevel: expense.heldFromLevel
        });
        expense.resubmissions = newResubmissions;

        await expenseApprovalModel.create({
            expenseId: expense.id,
            level: "FM",
            approverId: approverId,
            action: "Resubmitted",
            comment: fmComment.trim(),
            actionAt: new Date()
        });

        expense.currentStatus = "Pending";
        expense.currentApprovalLevel = expense.heldFromLevel;
        expense.heldFromLevel = null;
        expense.holdComment = "";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "Expense resubmitted successfully",
            data: expense
        });

    } catch (err) {
        console.error("Resubmit Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Resubmission failed"
        });
    }
};

/* ================= APPROVAL HISTORY ================= */
const approvalHistory = async (req, res) => {
    try {
        const { expenseId } = req.body;
        if (!expenseId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId is required"
            });
        }

        const data = await expenseApprovalModel.findAll({
            where: { expenseId },
            // include: [{ model: userModel, as: 'approver' }],
            order: [['actionAt', 'ASC']]
        });

        res.send({
            status: 200,
            success: true,
            message: "Approval History",
            data
        });

    } catch (err) {
        console.error("History Error:", err);
        res.send({
            status: 500,
            success: false,
            message: "History fetch failed"
        });
    }
};

const clmPendingExpenses = async (req, res) => {
    try {
        const clmId = req.body.userId;
        const clmUser = await userModel.findOne({ where: { id: clmId } });

        if (!clmUser || !Array.isArray(clmUser.storeId) || clmUser.storeId.length === 0) {
            return res.send({
                success: false,
                message: "No store mapping found for CLM",
                data: []
            });
        }

        const expenses = await expenseModel.findAll({
            where: {
                storeId: { [Op.in]: clmUser.storeId },
                currentStatus: "Pending",
                currentApprovalLevel: "CLM",
                status: true
            }
        });

        return res.send({
            success: true,
            data: expenses
        });

    } catch (err) {
        console.error("CLM Pending Expense Error:", err);
        return res.send({
            success: false,
            message: "CLM pending fetch failed"
        });
    }
};

const pendingForZH = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.send({ success: false, message: "userId is required" });
        }

        const zhData = await zhModel.findOne({ where: { userId } });
        if (!zhData || !zhData.zoneId) {
            return res.send({ success: false, message: "Zonal Head or zone not found" });
        }

        const zoneStores = await storeModel.findAll({
            where: { zoneId: zhData.zoneId },
            attributes: ['id']
        });

        const storeIds = zoneStores.map(s => s.id);
        if (storeIds.length === 0) {
            return res.send({ success: true, data: [] });
        }

        const expenses = await expenseModel.findAll({
            where: {
                storeId: { [Op.in]: storeIds },
                currentApprovalLevel: "ZONAL_HEAD",
                currentStatus: "Pending",
                status: true
            },
            order: [['createdAt', 'DESC']]
        });

        // Manual population for frontend compatibility
        const populatedExpenses = [];
        for (const exp of expenses) {
            const expJson = exp.toJSON();
            const store = await storeModel.findOne({ where: { id: exp.storeId } });
            const head = await expenseHeadModel.findOne({ where: { id: exp.expenseHeadId } });
            expJson.storeId = store;
            expJson.expenseHeadId = head;
            populatedExpenses.push(expJson);
        }

        return res.send({
            success: true,
            message: "Zonal Head Pending Expenses",
            data: populatedExpenses
        });

    } catch (err) {
        console.error("Zonal Head Pending Error:", err);
        return res.send({ success: false, message: "Zonal Head pending fetch failed" });
    }
};

const pendingForBF = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.send({ status: 422, success: false, message: "userId is required" });
        }

        const bfUser = await userModel.findOne({ where: { id: userId } });
        if (!bfUser) {
            return res.send({ status: 404, success: false, message: "User not found" });
        }

        let where = {
            currentApprovalLevel: "BUSINESS_FINANCE",
            currentStatus: "Pending",
            status: true
        };

        if (Array.isArray(bfUser.storeIds) && bfUser.storeIds.length > 0) {
            where.storeId = { [Op.in]: bfUser.storeIds };
        }

        const expenses = await expenseModel.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        return res.send({
            status: 200,
            success: true,
            message: "BF Pending Expenses",
            data: expenses
        });

    } catch (err) {
        console.error("BF Pending Error:", err);
        return res.send({ status: 500, success: false, message: "BF pending fetch failed" });
    }
};

const pendingForProcurement = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.send({ status: 422, success: false, message: "userId is required" });
        }

        const procurementUser = await userModel.findOne({ where: { id: userId } });
        if (!procurementUser) {
            return res.send({ status: 404, success: false, message: "User not found" });
        }

        let where = {
            currentApprovalLevel: "PROCUREMENT",
            currentStatus: "Pending",
            status: true
        };

        if (Array.isArray(procurementUser.storeIds) && procurementUser.storeIds.length > 0) {
            where.storeId = { [Op.in]: procurementUser.storeIds };
        }

        const expenses = await expenseModel.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        return res.send({
            status: 200,
            success: true,
            message: "Procurement Pending Expenses",
            data: expenses
        });

    } catch (err) {
        console.error("Procurement Pending Error:", err);
        return res.send({ status: 500, success: false, message: "Procurement pending fetch failed" });
    }
};

const prpoPendingExpenses = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.send({ status: 422, success: false, message: "userId is required" });
        }

        const expenses = await expenseModel.findAll({
            where: {
                currentApprovalLevel: "PR/PO",
                currentStatus: "Pending",
            },
            order: [['createdAt', 'DESC']]
        });

        return res.send({
            success: true,
            message: "PR/PO pending expenses fetched successfully",
            data: expenses,
        });
    } catch (error) {
        console.error("PR/PO Pending Expense Error:", error);
        return res.send({ success: false, message: "Something went wrong" });
    }
};

const expenseAction = async (req, res) => {
    try {
        const { expenseId, approverId, level, status, comment } = req.body;

        if (!expenseId || !approverId || !level || !status) {
            return res.send({
                success: false,
                message: "expenseId, approverId, level & status are required"
            });
        }

        const expense = await expenseModel.findOne({
            where: { id: expenseId }
        });

        if (!expense) {
            return res.send({ success: false, message: "Expense not found" });
        }

        await expenseApprovalModel.create({
            expenseId,
            approverId,
            level,
            action: status,
            comment: comment || ""
        });

        if (status === "Approved") {
            const policy = await approvalPolicyModel.findOne({ where: { id: expense.policyId } });
            const levels = policy.approvalLevels;
            const index = levels.indexOf(expense.currentApprovalLevel);

            if (index === levels.length - 1) {
                expense.currentStatus = "Approved";
                expense.currentApprovalLevel = null;
            } else {
                expense.currentApprovalLevel = levels[index + 1];
            }
        } else if (status === "Hold") {
            expense.currentStatus = "Hold";
        } else if (status === "Rejected") {
            expense.currentStatus = "Rejected";
            expense.currentApprovalLevel = null;
        }

        await expense.save();

        res.send({
            success: true,
            message: `Expense ${status} successfully`
        });

    } catch (err) {
        console.error("Expense Action Error:", err);
        res.send({ success: false, message: "Expense action failed" });
    }
};

const myApprovalActions = async (req, res) => {
    try {
        const { userId, action, level } = req.body;

        if (!userId || !action || !level) {
            return res.send({ success: false, message: "userId, action & level required" });
        }

        const history = await expenseApprovalModel.findAll({
            where: {
                approverId: userId,
                action: action,
                level: { [Op.like]: level } // Simple case-insensitive match for MySQL if needed
            },
            order: [['actionAt', 'DESC']]
        });

        // Filter unique expenseId and populate details
        const uniqueItems = [];
        const seenIds = new Set();

        for (const item of history) {
            if (!seenIds.has(item.expenseId)) {
                seenIds.add(item.expenseId);

                const itemJson = item.toJSON();
                const expense = await expenseModel.findOne({ where: { id: item.expenseId } });

                if (expense) {
                    const expJson = expense.toJSON();
                    const store = await storeModel.findOne({ where: { id: expense.storeId } });
                    const head = await expenseHeadModel.findOne({ where: { id: expense.expenseHeadId } });
                    expJson.storeId = store;
                    expJson.expenseHeadId = head;
                    itemJson.expenseId = expJson;
                    uniqueItems.push(itemJson);
                }
            }
        }

        return res.send({
            success: true,
            data: uniqueItems
        });

    } catch (err) {
        console.error("myApprovalActions error:", err);
        return res.send({ success: false, message: "Approval list fetch failed" });
    }
};

const adminExpensesByStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.send({ success: false, message: "Status is required" });
        }

        const expenses = await expenseModel.findAll({
            where: { currentStatus: status },
            order: [['createdAt', 'DESC']]
        });

        // Add additional data if Rejected or Closed (Sequelize version)
        const updatedExpenses = await Promise.all(
            expenses.map(async (exp) => {
                const expJson = exp.toJSON();
                if (status === "Rejected") {
                    const lastReject = await expenseApprovalModel.findOne({
                        where: { expenseId: exp.id, action: "Rejected" },
                        order: [['actionAt', 'DESC']]
                    });
                    if (lastReject) {
                        expJson.rejectionComment = lastReject.comment;
                        expJson.rejectedOn = lastReject.actionAt;
                        // For simplicity, omitted user name fetch here.
                    }
                }
                if (status === "Closed") {
                    const lastClose = await expenseApprovalModel.findOne({
                        where: { expenseId: exp.id, action: "Closed" },
                        order: [['actionAt', 'DESC']]
                    });
                    if (lastClose) {
                        expJson.closedOn = lastClose.actionAt;
                    }
                }
                expJson.currentAt = exp.currentApprovalLevel;
                return expJson;
            })
        );

        return res.send({ success: true, data: updatedExpenses });

    } catch (err) {
        console.error("Admin Fetch Error:", err);
        return res.send({ success: false, message: "Admin expense fetch failed" });
    }
};

const uploadWcrInvoice = async (req, res) => {
    try {
        const { expenseId, fmComment, fmId } = req.body;

        if (!expenseId || !fmComment?.trim() || !fmId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, fmId & fmComment are required",
            });
        }

        if (!req.files?.wcrAttachment || !req.files?.invoiceAttachment) {
            return res.send({
                status: 422,
                success: false,
                message: "WCR & Invoice are mandatory",
            });
        }

        const wcrUrl = req.files.wcrAttachment[0].path;
        const invoiceUrl = req.files.invoiceAttachment[0].path;

        const expense = await expenseModel.findOne({ where: { id: expenseId } });
        if (!expense) {
            return res.send({ status: 422, success: false, message: "Expense not found" });
        }

        expense.wcrAttachment = wcrUrl;
        expense.invoiceAttachment = invoiceUrl;
        expense.executionUploadedAt = new Date();
        expense.fmComment = fmComment.trim();

        if (expense.natureOfExpense === "CAPEX") {
            expense.currentApprovalLevel = "PR/PO";
            expense.currentStatus = "Pending";
            expense.postApprovalStage = "PRPO_EMAIL";
        } else {
            expense.currentApprovalLevel = "ZONAL_COMMERCIAL";
            expense.currentStatus = "Pending";
            expense.postApprovalStage = "ZC_VERIFY";
        }

        await expenseApprovalModel.create({
            expenseId: expense.id,
            level: "FM",
            approverId: fmId,
            action: "Approved",
            comment: `Execution Uploaded: ${fmComment.trim()}`,
            actionAt: new Date()
        });

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "WCR & Invoice uploaded successfully",
        });

    } catch (err) {
        console.error("FM Upload Error:", err);
        return res.send({ status: 500, success: false, message: "Upload failed" });
    }
};

const verifyAndCloseExpense = async (req, res) => {
    try {
        const { expenseId, prismId, comment, approverId } = req.body;

        if (!expenseId || !prismId || !approverId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, prismId & approverId are required"
            });
        }

        const expense = await expenseModel.findOne({ where: { id: expenseId } });

        if (!expense) {
            return res.send({ status: 422, success: false, message: "Expense not found" });
        }

        if (expense.natureOfExpense === "CAPEX") {
            return res.send({
                status: 422,
                success: false,
                message: "CAPEX expenses are not verified by Zonal Commercial"
            });
        }

        if (
            expense.currentApprovalLevel !== "ZONAL_COMMERCIAL" ||
            expense.postApprovalStage !== "ZC_VERIFY"
        ) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not eligible for verification"
            });
        }

        if (!expense.wcrAttachment || !expense.invoiceAttachment) {
            return res.send({
                status: 422,
                success: false,
                message: "WCR & Invoice must be uploaded before verification"
            });
        }

        expense.prismId = prismId;
        expense.currentStatus = "Closed";
        expense.postApprovalStage = "CLOSED";
        expense.currentApprovalLevel = null;

        await expense.save();

        await expenseApprovalModel.create({
            expenseId: expense.id,
            level: "ZONAL_COMMERCIAL",
            approverId,
            action: "Closed",
            comment: prismId,
            actionAt: new Date()
        });

        return res.send({
            status: 200,
            success: true,
            message: "Expense verified and closed successfully"
        });

    } catch (err) {
        console.error("ZC Verify Error:", err);
        return res.send({ status: 500, success: false, message: "Verification failed" });
    }
};

const zonalCommercialPending = async (req, res) => {
    try {
        const data = await expenseModel.findAll({
            where: {
                currentApprovalLevel: "ZONAL_COMMERCIAL",
                postApprovalStage: "ZC_VERIFY",
                status: true
            },
            order: [['createdAt', 'DESC']]
        });

        return res.send({ success: true, data });

    } catch (err) {
        console.error("ZC Pending Error:", err);
        return res.send({ success: false, message: "Failed to fetch ZC pending expenses" });
    }
};

const prpoEmailAndClose = async (req, res) => {
    try {
        const { expenseId, approverId, prPoEmailSubject } = req.body;

        if (!expenseId || !approverId || !prPoEmailSubject?.trim()) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, approverId & email subject are required",
            });
        }

        const expense = await expenseModel.findOne({ where: { id: expenseId } });
        if (!expense) {
            return res.send({ status: 422, success: false, message: "Expense not found" });
        }

        if (
            expense.currentApprovalLevel !== "PR/PO" ||
            expense.postApprovalStage !== "PRPO_EMAIL" ||
            expense.currentStatus !== "Pending"
        ) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not eligible for final closure",
            });
        }

        expense.prPoEmailSubject = prPoEmailSubject.trim();
        expense.currentStatus = "Closed";
        expense.currentApprovalLevel = null;
        expense.postApprovalStage = "CLOSED";

        await expense.save();

        await expenseApprovalModel.create({
            expenseId: expense.id,
            level: "PR/PO",
            approverId,
            action: "Closed",
            comment: prPoEmailSubject.trim(),
            actionAt: new Date(),
        });

        return res.send({
            status: 200,
            success: true,
            message: "Expense closed successfully",
        });

    } catch (err) {
        console.error("PR/PO Close Error:", err);
        return res.send({ status: 500, success: false, message: "Final closure failed" });
    }
};

module.exports = {
    approveExpense,
    holdExpense,
    rejectExpense,
    approvalHistory,
    clmPendingExpenses,
    pendingForProcurement,
    pendingForBF,
    pendingForZH,
    expenseAction,
    myApprovalActions,
    resubmitHeldExpense,
    adminExpensesByStatus,
    prpoPendingExpenses,
    uploadWcrInvoice,
    verifyAndCloseExpense,
    zonalCommercialPending,
    prpoEmailAndClose
}
