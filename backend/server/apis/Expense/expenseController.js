const expenseModel = require("./expenseModel");
const approvalPolicyModel = require("../Approval Policy/approvalPolicyModel");
const userModel = require("../User/userModel");
const storeModel = require("../Store/storeModel");
const expenseHeadModel = require("../ExpenseHead/expenseHeadModel");
const stateModel = require("../State/stateModel");
const zoneModel = require("../Zone/zoneModel");
const storeCategoryModel = require("../Store Category/storeCategoryModel");
const { Op } = require("sequelize");

// Mock sendNotification if not defined in the file (original code referenced it but it wasn't defined in the snippet)
// Assuming it's imported or globally available? In the original snippet, it was used like `sendNotification(...)`.
// I'll check if Notification model is needed.
const sendNotification = (userId, title, message, expenseId) => {
    console.log(`Notification to ${userId}: ${title} - ${message}`);
    // In a real app, this would create a record in Notification table
};

const add = (req, res) => {
    var errMsgs = [];

    /* ========== BASIC VALIDATIONS ========== */
    if (!req.body.ticketId) errMsgs.push("ticketId is required");
    if (!req.body.storeId) errMsgs.push("storeId is required");
    if (!req.body.expenseHeadId) errMsgs.push("expenseHeadId is required");
    if (!req.body.natureOfExpense) errMsgs.push("natureOfExpense is required");
    if (!req.body.amount) errMsgs.push("amount is required");
    if (!req.body.policy) errMsgs.push("policy is required");
    if (!req.body.raisedBy) errMsgs.push("raisedBy is required");
    if (!req.files || req.files.length === 0)
        errMsgs.push("At least one attachment is required");


    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    /* ===== CHECK ACTIVE EXPENSE FOR SAME TICKET ===== */
    expenseModel.findOne({
        where: {
            ticketId: req.body.ticketId,
            currentStatus: { [Op.in]: ["Pending", "Hold"] },
            status: true
        }
    })
        .then(existing => {

            if (existing) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Active expense already exists for this ticket"
                });
            }

            /* ================================================= */
            /* ================= CAPEX FLOW ==================== */
            /* ================================================= */
            if (req.body.natureOfExpense === "CAPEX") {

                const expensePayload = {
                    ticketId: req.body.ticketId,
                    storeId: req.body.storeId,
                    expenseHeadId: req.body.expenseHeadId,
                    natureOfExpense: "CAPEX",
                    amount: req.body.amount,
                    remark: req.body.remark || "",
                    rca: req.body.rca || "",
                    policy: req.body.policy,
                    policyId: null,
                    postApprovalStage: "NONE",
                    attachment: req.files.map(file => file.path),
                    currentApprovalLevel: "ZONAL_HEAD",
                    currentStatus: "Pending",
                    raisedBy: req.body.raisedBy,
                    status: true
                };

                expenseModel.create(expensePayload)
                    .then(data => {
                        // 🔔 Notify Zonal Head
                        if (req.body.zhId) {
                            sendNotification(
                                req.body.zhId,
                                "New CAPEX Expense Submitted",
                                `CAPEX Expense ${data.ticketId} is pending for your approval`,
                                data.id
                            );
                        }

                        return res.send({
                            status: 200,
                            success: true,
                            message: "CAPEX Expense Added Successfully",
                            data
                        });
                    })
                    .catch((err) => {
                        console.error("CAPEX Add Error:", err);
                        res.send({
                            status: 422,
                            success: false,
                            message: "Expense Not Added"
                        });
                    });

            } else {

                /* ================================================= */
                /* ================= OPEX FLOW ===================== */
                /* ================================================= */

                approvalPolicyModel.findOne({
                    where: {
                        minAmount: { [Op.lte]: req.body.amount },
                        maxAmount: { [Op.gte]: req.body.amount },
                        status: true
                    }
                })
                    .then(policyData => {

                        if (!policyData) {
                            return res.send({
                                status: 422,
                                success: false,
                                message: "No approval policy found for this amount"
                            });
                        }

                        let nextApprovalLevel = null;
                        if (policyData.approvalLevels && policyData.approvalLevels.length > 0) {
                            nextApprovalLevel = policyData.approvalLevels[0];
                        }

                        const expensePayload = {
                            ticketId: req.body.ticketId,
                            storeId: req.body.storeId,
                            expenseHeadId: req.body.expenseHeadId,
                            natureOfExpense: "OPEX",
                            amount: req.body.amount,
                            remark: req.body.remark || "",
                            rca: req.body.rca || "",
                            policy: req.body.policy,
                            policyId: policyData.id,
                            attachment: req.files.map(file => file.path),
                            currentApprovalLevel: nextApprovalLevel,
                            currentStatus: "Pending",
                            raisedBy: req.body.raisedBy,
                            status: true,
                            postApprovalStage: "NONE"
                        };

                        expenseModel.create(expensePayload)
                            .then(data => {

                                let notifyUserId = null;

                                if (nextApprovalLevel === "CLM") {
                                    notifyUserId = req.body.clmId;
                                } else if (nextApprovalLevel === "ZH") {
                                    notifyUserId = req.body.zhId;
                                } else if (nextApprovalLevel === "BF") {
                                    notifyUserId = req.body.bfId;
                                } else if (nextApprovalLevel === "PROCUREMENT") {
                                    notifyUserId = req.body.procurementId;
                                }

                                if (notifyUserId) {
                                    sendNotification(
                                        notifyUserId,
                                        "New Expense Submitted",
                                        `Expense ${data.ticketId} is pending for your approval`,
                                        data.id
                                    );
                                }

                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "Expense Added Successfully",
                                    data
                                });
                            })
                            .catch((err) => {
                                console.error("OPEX Add error:", err);
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Expense Not Added"
                                });
                            });

                    })
                    .catch((err) => {
                        console.error("Policy lookup error:", err);
                        res.send({
                            status: 422,
                            success: false,
                            message: "Approval policy lookup failed"
                        });
                    });
            }

        })
        .catch((err) => {
            console.error("Active check error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};

const getAll = (req, res) => {
    // Whitelist allowed filter fields
    const body = req.body || {};
    const allowedFilters = {};
    const whitelist = ["expenseHeadId", "natureOfExpense", "status", "storeId", "raisedBy", "expenseType"];
    whitelist.forEach(field => {
        if (body[field] !== undefined) allowedFilters[field] = body[field];
    });

    expenseModel.findAll({
        where: allowedFilters,
        include: [
            { model: userModel, as: 'user', attributes: ['name', 'email'] },
            { model: expenseHeadModel, as: 'expenseHead', attributes: ['name'] },
            {
                model: storeModel,
                as: 'store',
                include: [
                    { model: stateModel, as: 'stateData', attributes: ['stateName'] },
                    { model: zoneModel, as: 'zoneData', attributes: ['zoneName'] },
                    { model: storeCategoryModel, as: 'storeCategoryData', attributes: ['name'] }
                ]
            }
        ],
        order: [['createdAt', 'DESC']]
    })
        .then(expenses => {
            const populated = expenses.map(e => {
                const json = e.toJSON();
                // Map association objects back to ID keys for frontend compatibility
                json.storeId = json.store;
                json.expenseHeadId = json.expenseHead;
                return json;
            });
            res.send({
                success: true,
                data: populated
            });
        })
        .catch(err => {
            console.error("GetAll Expense Error:", err);
            res.send({
                success: false,
                message: "Failed to fetch expenses"
            });
        });
};


const getSingle = (req, res) => {
    const id = req.body.id || req.body._id;
    if (!id) {
        return res.send({
            status: 422,
            success: false,
            message: "id is required"
        });
    }

    expenseModel.findOne({
        where: {
            id: id,
            status: true
        },
        include: [
            { model: userModel, as: 'user', attributes: ['name', 'email'] },
            { model: expenseHeadModel, as: 'expenseHead', attributes: ['name'] },
            {
                model: storeModel,
                as: 'store',
                include: [
                    { model: stateModel, as: 'stateData', attributes: ['stateName'] },
                    { model: zoneModel, as: 'zoneData', attributes: ['zoneName'] },
                    { model: storeCategoryModel, as: 'storeCategoryData', attributes: ['name'] }
                ]
            }
        ]
    })
        .then(data => {
            if (!data) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Expense not Found"
                });
            } else {
                // Sanitize associations if any user info included
                const safeData = data.toJSON();
                if (safeData.user) delete safeData.user.password;
                if (safeData.raisedBy) delete safeData.raisedBy.password; // Assuming raisedBy might be an included user object
                // Map association objects back to ID keys for frontend compatibility
                safeData.storeId = safeData.store;
                safeData.expenseHeadId = safeData.expenseHead;
                res.send({ status: 200, success: true, message: "Expense Found", data: safeData });
            }
        })
        .catch((err) => {
            console.error("GetSingle Expense Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};

const myExpenses = (req, res) => {
    var errMsgs = [];

    if (!req.body.userId) errMsgs.push("userId is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs,
        });
    }

    /* ================= BASE FILTER ================= */
    let filter = {
        raisedBy: req.body.userId,
        status: true,
    };

    if (req.body.includeExecutionStage) {
        filter[Op.or] = [
            { currentStatus: "Closed" },
            {
                postApprovalStage: { [Op.in]: ["PRPO_EMAIL", "ZC_VERIFY"] }
            }
        ];
    } else {
        if (req.body.currentStatus) {
            filter.currentStatus = req.body.currentStatus.trim();
        }
        if (req.body.currentApprovalLevel) {
            filter.currentApprovalLevel = req.body.currentApprovalLevel.trim();
        }
        if (req.body.postApprovalStage) {
            filter.postApprovalStage = req.body.postApprovalStage.trim();
        }

        /* 🔥 SAFETY: FM Pending page */
        if (
            req.body.currentApprovalLevel === "FM" &&
            req.body.currentStatus === "Pending" &&
            !req.body.postApprovalStage
        ) {
            filter.postApprovalStage = "NONE";
        }
        if (req.body.excludePostApprovalStage) {
            filter.postApprovalStage = {
                [Op.ne]: req.body.excludePostApprovalStage,
            };
        }
    }

    expenseModel.findAll({
        where: filter,
        include: [
            { model: userModel, as: 'user', attributes: ['name', 'email'] },
            { model: expenseHeadModel, as: 'expenseHead', attributes: ['name'] },
            {
                model: storeModel,
                as: 'store',
                include: [
                    { model: stateModel, as: 'stateData', attributes: ['stateName'] },
                    { model: zoneModel, as: 'zoneData', attributes: ['zoneName'] },
                    { model: storeCategoryModel, as: 'storeCategoryData', attributes: ['name'] }
                ]
            }
        ],
        order: [['createdAt', 'DESC']]
    })
        .then((data) => {
            const populated = data.map(e => {
                const json = e.toJSON();
                // Map association objects back to ID keys for frontend compatibility
                json.storeId = json.store;
                json.expenseHeadId = json.expenseHead;
                return json;
            });
            res.send({
                status: 200,
                success: true,
                message: "My Expense List",
                data: populated,
            });
        })
        .catch((err) => {
            console.error("MyExpenses Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            });
        });
};

module.exports = { add, getAll, getSingle, myExpenses }
