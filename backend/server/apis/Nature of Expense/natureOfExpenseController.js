const NatureOfExpenseModel = require("./natuteOfExpenseModel");
const { Op } = require("sequelize");

const add = (req, res) => {
    var errMsgs = [];
    if (!req.body.name) errMsgs.push("name is required");
    if (!req.body.ExpenseHeadId) errMsgs.push("ExpenseHeadId is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    NatureOfExpenseModel.findOne({ where: { name: req.body.name } })
        .then((natureOfExpenseData) => {
            if (natureOfExpenseData == null) {
                const payload = {
                    name: req.body.name,
                    ExpenseHeadId: req.body.ExpenseHeadId,
                    status: true
                };

                NatureOfExpenseModel.create(payload)
                    .then((data) => {
                        res.send({
                            status: 200,
                            success: true,
                            message: "Nature of Expense Added Successfully",
                            data: data.toJSON()
                        });
                    })
                    .catch((err) => {
                        console.error("NOE Create Error:", err);
                        res.send({ status: 422, success: false, message: "Nature of Expense Not Added" });
                    });
            } else {
                res.send({ status: 422, success: false, message: "Nature of Expense Already Exists" });
            }
        })
        .catch((err) => {
            console.error("NOE Find Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const getAll = (req, res) => {
    // Whitelist allowed filter fields
    const allowedFilters = {};
    if (req.body.ExpenseHeadId) allowedFilters.ExpenseHeadId = req.body.ExpenseHeadId;
    if (req.body.status !== undefined) allowedFilters.status = req.body.status;

    NatureOfExpenseModel.findAll({ where: allowedFilters })
        .then((data) => {
            if (data.length == 0) {
                res.send({ status: 402, success: false, message: "Nature of Expense is Empty" });
            } else {
                res.send({ status: 200, success: true, message: "Nature of Expense Found", data: data });
            }
        })
        .catch((err) => {
            console.error("NOE GetAll Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const getSingle = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    NatureOfExpenseModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Nature of Expense not Found" });
            } else {
                res.send({ status: 200, success: true, message: "Nature of Expense Found", data: data.toJSON() });
            }
        })
        .catch((err) => {
            console.error("NOE GetSingle Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const update = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    const checkDuplicatePromise = req.body.name
        ? NatureOfExpenseModel.findOne({ where: { name: req.body.name, id: { [Op.ne]: id } } })
        : Promise.resolve(null);

    checkDuplicatePromise
        .then((existing) => {
            if (existing) {
                res.send({ status: 422, success: false, message: "Nature of Expense Already Exists with same name" });
            } else {
                NatureOfExpenseModel.findOne({ where: { id: id } })
                    .then((noeData) => {
                        if (noeData == null) {
                            res.send({ status: 422, success: false, message: "Nature of Expense not Found" });
                        } else {
                            if (req.body.name) noeData.name = req.body.name;
                            if (req.body.ExpenseHeadId) noeData.ExpenseHeadId = req.body.ExpenseHeadId;

                            noeData.save()
                                .then((updated) => {
                                    res.send({ status: 200, success: true, message: "Nature of Expense Updated Successfully", data: updated.toJSON() });
                                })
                                .catch(() => res.send({ status: 422, success: false, message: "Nature of Expense not Updated" }));
                        }
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

const delNoE = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    NatureOfExpenseModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Data not Found" });
            } else {
                data.destroy()
                    .then(() => res.send({ status: 200, success: true, message: "Data Deleted Successfully" }))
                    .catch(() => res.send({ status: 422, success: false, message: "Data not Deleted Successfully" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

const changeStatus = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");
    if (req.body.status === undefined) errMsgs.push("status is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    NatureOfExpenseModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Data not Found" });
            } else {
                data.status = req.body.status;
                data.save()
                    .then((saved) => res.send({ status: 200, success: true, message: "Status Updated Successfully", data: saved }))
                    .catch(() => res.send({ status: 422, success: false, message: "Status Not Updated " }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

module.exports = { add, getAll, getSingle, update, delNoE, changeStatus };