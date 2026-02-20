const storeCategoryModel = require("./storeCategoryModel");
const { Op } = require("sequelize");

const add = (req, res) => {
    var errMsgs = [];
    if (!req.body.name) errMsgs.push("name is required");
    if (!req.body.description) errMsgs.push("description is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    storeCategoryModel.findOne({ where: { name: req.body.name } })
        .then((data) => {
            if (data == null) {
                const payload = {
                    name: req.body.name,
                    description: req.body.description,
                    status: true
                };

                storeCategoryModel.create(payload)
                    .then((newData) => res.send({ status: 200, success: true, message: "Store Category Added Successfully", data: newData }))
                    .catch((err) => {
                        console.error("StoreCategory Add Error:", err);
                        res.send({ status: 422, success: false, message: "Store Category Not Added" });
                    });
            } else {
                res.send({ status: 422, success: false, message: "Store Category Already Exists" });
            }
        })
        .catch((err) => {
            console.error("StoreCategory Find Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const getAll = (req, res) => {
    storeCategoryModel.findAll({ where: req.body })
        .then((data) => {
            if (data.length == 0) {
                res.send({ status: 402, success: false, message: "Store Category is Empty" });
            } else {
                res.send({ status: 200, success: true, message: "Store Category Found", data: data });
            }
        })
        .catch((err) => {
            console.error("StoreCategory GetAll Error:", err);
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

    storeCategoryModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Store Category not Found" });
            } else {
                res.send({ status: 200, success: true, message: "Store Category Found", data: data });
            }
        })
        .catch((err) => {
            console.error("StoreCategory GetSingle Error:", err);
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
        ? storeCategoryModel.findOne({ where: { name: req.body.name, id: { [Op.ne]: id } } })
        : Promise.resolve(null);

    checkDuplicatePromise
        .then((existing) => {
            if (existing) {
                res.send({ status: 422, success: false, message: "Store Category Already Exists with same Name" });
            } else {
                storeCategoryModel.findOne({ where: { id: id } })
                    .then((data) => {
                        if (data == null) {
                            res.send({ status: 422, success: false, message: "Store Category not Found" });
                        } else {
                            if (req.body.name) data.name = req.body.name;
                            if (req.body.description) data.description = req.body.description;
                            data.save()
                                .then((updated) => res.send({ status: 200, success: true, message: "Store Category Updated Successfully", data: updated }))
                                .catch(() => res.send({ status: 422, success: false, message: "Store Category not Updated" }));
                        }
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

const delStoreCategory = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    storeCategoryModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Store Category not Found" });
            } else {
                data.destroy()
                    .then(() => res.send({ status: 200, success: true, message: "Store Category Deleted Successfully" }))
                    .catch(() => res.send({ status: 422, success: false, message: "Store Category not Deleted " }));
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

    storeCategoryModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Store Category not Found" });
            } else {
                data.status = req.body.status;
                data.save()
                    .then((saved) => res.send({ status: 200, success: true, message: "Status Updated Successfully", data: saved }))
                    .catch(() => res.send({ status: 422, success: false, message: "Status Not Updated " }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

module.exports = { add, getAll, getSingle, update, delStoreCategory, changeStatus };