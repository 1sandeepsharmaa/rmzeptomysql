//paarth
const approvalPolicyModel = require("./approvalPolicyModel");
const { Op } = require("sequelize");

/* ===================== ADD APPROVAL POLICY ===================== */
const add = (req, res) => {
    var errMsgs = [];

    if (req.body.minAmount === undefined) errMsgs.push("minAmount is required");
    if (req.body.maxAmount === undefined) errMsgs.push("maxAmount is required");
    if (!req.body.approvalLevels || req.body.approvalLevels.length === 0) {
        errMsgs.push("approvalLevels are required");
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    const minAmount = Number(req.body.minAmount);
    const maxAmount = Number(req.body.maxAmount);

    if (minAmount > maxAmount) {
        return res.send({
            status: 422,
            success: false,
            message: "minAmount cannot be greater than maxAmount"
        });
    }

    /* ===== CHECK OVERLAPPING POLICY ===== */
    // Sequelize doesn't have direct $lte/$gte in same way for overlapping ranges logic without Op
    // Mongoose: minAmount: { $lte: maxAmount }, maxAmount: { $gte: minAmount }
    // Sequelize: minAmount <= maxAmount AND maxAmount >= minAmount

    approvalPolicyModel.findOne({
        where: {
            minAmount: { [Op.lte]: maxAmount },
            maxAmount: { [Op.gte]: minAmount }
        }
    })
        .then(existing => {
            if (existing) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Approval policy already exists for this amount range"
                });
            }

            const policyPayload = {
                minAmount: minAmount,
                maxAmount: maxAmount,
                approvalLevels: req.body.approvalLevels, // JSON type in model
                status: true
            };

            approvalPolicyModel.create(policyPayload)
                .then(data => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Approval Policy Added Successfully",
                        data
                    });
                })
                .catch((err) => {
                    console.error("Approval Policy Add Error:", err);
                    res.send({
                        status: 422,
                        success: false,
                        message: "Approval Policy Not Added"
                    });
                });
        })
        .catch((err) => {
            console.error("Approval Policy Check Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};



const getAll = (req, res) => {

    approvalPolicyModel.findAll({})
        .then(data => {
            res.send({
                status: 200,
                success: true,
                message: "Approval Policy List",
                data
            });
        })
        .catch((err) => {
            console.error("Approval Policy GetAll Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
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

    approvalPolicyModel.findOne({ where: { id: id } })
        .then(data => {
            if (!data) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Approval Policy not Found"
                });
            } else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Approval Policy Found",
                    data
                });
            }
        })
        .catch((err) => {
            console.error("Approval Policy GetSingle Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};

const update = (req, res) => {
    var errMsgs = [];

    const id = req.body.id || req.body._id;

    if (!id) errMsgs.push("id is required");
    if (req.body.minAmount === undefined && req.body.minAmount !== 0 && !req.body.maxAmount && !req.body.approvalLevels) {
        // Relax validation slightly to allow partial updates if intended, but keeping original logic mostly
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    // If min/max are provided, check val
    if (req.body.minAmount !== undefined && req.body.maxAmount !== undefined) {
        if (req.body.minAmount > req.body.maxAmount) {
            return res.send({
                status: 422,
                success: false,
                message: "minAmount cannot be greater than maxAmount"
            });
        }
    }

    approvalPolicyModel.findOne({ where: { id: id } })
        .then(policy => {

            if (!policy) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Approval Policy not Found"
                });
            }

            const newMin = req.body.minAmount !== undefined ? req.body.minAmount : policy.minAmount;
            const newMax = req.body.maxAmount !== undefined ? req.body.maxAmount : policy.maxAmount;

            // Check overlapping exclusion
            // _id: { $ne: req.body._id }, status: true, minAmount: { $lte: req.body.maxAmount }, maxAmount: { $gte: req.body.minAmount }

            approvalPolicyModel.findOne({
                where: {
                    id: { [Op.ne]: id },
                    status: true,
                    minAmount: { [Op.lte]: newMax },
                    maxAmount: { [Op.gte]: newMin }
                }
            })
                .then(existing => {

                    if (existing) {
                        return res.send({
                            status: 422,
                            success: false,
                            message: "Approval policy already exists for this amount range"
                        });
                    }

                    if (req.body.minAmount !== undefined) policy.minAmount = req.body.minAmount;
                    if (req.body.maxAmount !== undefined) policy.maxAmount = req.body.maxAmount;
                    if (req.body.approvalLevels) policy.approvalLevels = req.body.approvalLevels;

                    policy.save()
                        .then(data => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Approval Policy Updated Successfully",
                                data
                            });
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Approval Policy Not Updated"
                            });
                        });

                });

        })
        .catch((err) => {
            console.error("Approval Policy Update Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};

const delApprovalPolicy = (req, res) => {
    var errMsgs = []
    const id = req.body.id || req.body._id;
    if (!id) {
        errMsgs.push("id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        approvalPolicyModel.findOne({ where: { id: id } })
            .then((approvalPolicyData) => {
                if (approvalPolicyData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Approval Policy not Found"
                    })
                }
                else {
                    approvalPolicyData.destroy()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Approval Policy Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Approval Policy not Deleted "
                            })
                        })
                }
            })
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const changeStatus = (req, res) => {
    const id = req.body.id || req.body._id;
    if (!id) {
        return res.send({
            status: 422,
            success: false,
            message: "id are required"
        });
    }

    approvalPolicyModel.findOne({ where: { id: id } })
        .then(policy => {

            if (!policy) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Approval Policy not Found"
                });
            }

            policy.status = req.body.status;

            policy.save()
                .then(data => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Approval Policy Status Updated Successfully",
                        data
                    });
                })
                .catch(() => {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Status Not Updated"
                    });
                });

        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};


module.exports = { add, getAll, getSingle, update, delApprovalPolicy, changeStatus }