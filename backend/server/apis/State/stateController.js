const stateModel = require("./stateModel");
const { Op } = require("sequelize");

const add = (req, res) => {
    var errMsgs = [];
    if (!req.body.stateName) errMsgs.push("stateName is required");
    if (!req.body.zoneId) errMsgs.push("zoneId is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    stateModel.findOne({ where: { stateName: req.body.stateName } })
        .then((stateData) => {
            if (stateData == null) {
                const payload = {
                    stateName: req.body.stateName,
                    zoneId: req.body.zoneId,
                    status: true
                };

                stateModel.create(payload)
                    .then((data) => {
                        res.send({
                            status: 200,
                            success: true,
                            message: "State Added Successfully",
                            data: data.toJSON()
                        });
                    })
                    .catch((err) => {
                        console.error("State Create Error:", err);
                        res.send({ status: 422, success: false, message: "State Not Added" });
                    });
            } else {
                res.send({ status: 422, success: false, message: "State Already Exists" });
            }
        })
        .catch((err) => {
            console.error("State Find Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const getAll = (req, res) => {
    // Whitelist allowed filter fields
    const body = req.body || {};
    const allowedFilters = {};
    if (body.zoneId) allowedFilters.zoneId = body.zoneId;
    if (body.status !== undefined) allowedFilters.status = body.status;

    stateModel.findAll({
        where: allowedFilters,
        include: [{ model: require("../Zone/zoneModel"), as: 'zoneData' }]
    })
        .then((data) => {
            console.log("State GetAll Data Sample:", data[0]?.toJSON?.());
            if (data.length == 0) {
                res.send({ status: 200, success: true, message: "State is Empty", data: [] }); // Changed status to 200 for consistency if successful
            } else {
                res.send({ status: 200, success: true, message: "State Found", data: data });
            }
        })
        .catch((err) => {
            console.error("State GetAll Error:", err);
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

    stateModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "State not Found" });
            } else {
                res.send({ status: 200, success: true, message: "State Found", data: data });
            }
        })
        .catch((err) => {
            console.error("State GetSingle Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const update = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");
    if (!req.body.zoneId) errMsgs.push("zoneId is required");
    if (!req.body.stateName) errMsgs.push("stateName is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    stateModel.findOne({ where: { id: id } })
        .then((stateData) => {
            if (stateData == null) {
                res.send({ status: 422, success: false, message: "State not Found" });
            } else {
                stateData.stateName = req.body.stateName;
                stateData.zoneId = req.body.zoneId;
                stateData.save()
                    .then((updated) => res.send({ status: 200, success: true, message: "State Updated Successfully", data: updated.toJSON() }))
                    .catch(() => res.send({ status: 422, success: false, message: "State not Updated" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
};

const delState = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    stateModel.findOne({ where: { id: id } })
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

    stateModel.findOne({ where: { id: id } })
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

module.exports = { add, getAll, getSingle, update, delState, changeStatus };