const expenseHeadModel = require("./expenseHeadModel")
const { Op } = require("sequelize");

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("name is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        expenseHeadModel.findOne({ where: { name: req.body.name } })
            .then((expenseHeadData) => {
                if (expenseHeadData == null) {
                    const expenseHeadPayload = {
                        name: req.body.name,
                        status: true
                    };

                    expenseHeadModel.create(expenseHeadPayload)
                        .then((expenseHeadData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "ExpenseHead Added Successfully",
                                data: expenseHeadData
                            })
                        })
                        .catch((err) => {
                            console.error("ExpenseHead Add Error:", err);
                            res.send({
                                status: 422,
                                success: false,
                                message: "ExpenseHead Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "ExpenseHead Already Exists"
                    })
                }
            })
            .catch((err) => {
                console.error("ExpenseHead Check Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })

    }
}

const getAll = (req, res) => {
    // req.body used for filter
    expenseHeadModel.findAll({ where: req.body })
        .then((expenseHeadData) => {
            if (expenseHeadData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "ExpenseHead is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "ExpenseHead Found",
                    data: expenseHeadData
                })

            }
        })
        .catch((err) => {
            console.error("ExpenseHead GetAll Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            })
        })
}

const getSingle = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
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
        const id = req.body.id || req.body._id;
        expenseHeadModel.findOne({ where: { id: id } })
            .then((expenseHeadData) => {
                if (expenseHeadData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "ExpenseHead not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "ExpenseHead Found",
                        data: expenseHeadData
                    })
                }
            })
            .catch((err) => {
                console.error("ExpenseHead GetSingle Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Somehting Went Wrong"
                })
            })
    }
}

const update = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
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
        const id = req.body.id || req.body._id;

        const checkDuplicatePromise = req.body.name
            ? expenseHeadModel.findOne({ where: { name: req.body.name } })
            : Promise.resolve(null);

        checkDuplicatePromise
            .then((existing) => {
                if (existing && existing.id.toString() !== id.toString()) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "ExpenseHead Already Exists with same Name"
                    })
                }
                else {
                    expenseHeadModel.findOne({ where: { id: id } })
                        .then((expenseHeadData) => {
                            if (expenseHeadData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "ExpenseHead not Found"
                                })
                            }
                            else {
                                if (req.body.name) {
                                    expenseHeadData.name = req.body.name
                                }
                                expenseHeadData.save()
                                    .then((expenseHeadData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "ExpenseHead Updated Successfully",
                                            data: expenseHeadData
                                        })
                                    })
                                    .catch((err) => {
                                        console.error("ExpenseHead Update Save Error:", err);
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "ExpenseHead not Updated"
                                        })
                                    })
                            }
                        })
                        .catch((err) => {
                            console.error("ExpenseHead Update Fetch Error:", err);
                            res.send({
                                status: 422,
                                success: false,
                                message: "Internal Server Error"
                            })
                        })

                }
            })
            .catch((err) => {
                console.error("ExpenseHead Update Duplicate Check Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })

    }
}

const delExpenseHead = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
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
        const id = req.body.id || req.body._id;
        expenseHeadModel.findOne({ where: { id: id } })
            .then((expenseHeadData) => {
                if (expenseHeadData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "ExpenseHead not Found"
                    })
                }
                else {
                    expenseHeadData.destroy()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "ExpenseHead Deleted Successfully"
                            })
                        })
                        .catch((err) => {
                            console.error("ExpenseHead Delete Error:", err);
                            res.send({
                                status: 422,
                                success: false,
                                message: "ExpenseHead not Deleted "
                            })
                        })
                }
            })
            .catch((err) => {
                console.error("ExpenseHead Delete Fetch Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const changeStatus = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required")
    }
    if (req.body.status === undefined) {
        errMsgs.push("status is required")

    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        const id = req.body.id || req.body._id;
        expenseHeadModel.findOne({ where: { id: id } })
            .then((expenseHeadData) => {
                if (expenseHeadData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "ExpenseHead not Found"
                    })
                }
                else {
                    expenseHeadData.status = req.body.status
                    expenseHeadData.save()
                        .then((expenseHeadData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Successfully Updated",
                                data: expenseHeadData
                            })
                        })
                        .catch((err) => {
                            console.error("ExpenseHead Status Update Error:", err);
                            res.send({
                                status: 422,
                                success: false,
                                message: "Status Not Updated "
                            })
                        })
                }
            })
            .catch((err) => {
                console.error("ExpenseHead Status Check Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}


module.exports = { add, getAll, getSingle, update, delExpenseHead, changeStatus }