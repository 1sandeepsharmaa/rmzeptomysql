const zoneModel = require("./zoneModel");
const { Op } = require("sequelize");

const add = (req, res) => {
    var errMsgs = [];
    if (!req.body.zoneName) errMsgs.push("zoneName is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    zoneModel.findOne({ where: { zoneName: req.body.zoneName } })
        .then((data) => {
            if (data == null) {
                const payload = {
                    zoneName: req.body.zoneName,
                    status: true
                };

                zoneModel.create(payload)
                    .then((newData) => res.send({ status: 200, success: true, message: "Zone Added Successfully", data: newData }))
                    .catch((err) => {
                        console.error("Zone Add Error:", err);
                        res.send({ status: 422, success: false, message: "Zone Not Added" });
                    });
            } else {
                res.send({ status: 422, success: false, message: "Zone Already Exists" });
            }
        })
        .catch((err) => {
            console.error("Zone Find Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const getAll = (req, res) => {
    zoneModel.findAll({ where: req.body })
        .then((data) => {
            if (data.length == 0) {
                res.send({ status: 402, success: false, message: "Zone is Empty", data: data });
            } else {
                res.send({ status: 200, success: true, message: "Zone Found", data: data });
            }
        })
        .catch((err) => {
            console.error("Zone GetAll Error:", err);
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

    zoneModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Zone not Found" });
            } else {
                res.send({ status: 200, success: true, message: "Zone Found", data: data });
            }
        })
        .catch((err) => {
            console.error("Zone GetSingle Error:", err);
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

    const checkDuplicatePromise = req.body.zoneName
        ? zoneModel.findOne({ where: { zoneName: req.body.zoneName, id: { [Op.ne]: id } } })
        : Promise.resolve(null);

    checkDuplicatePromise
        .then((existing) => {
            if (existing) {
                res.send({ status: 422, success: false, message: "Zone Already Exists with same Name" });
            } else {
                zoneModel.findOne({ where: { id: id } })
                    .then((data) => {
                        if (data == null) {
                            res.send({ status: 422, success: false, message: "Zone not Found" });
                        } else {
                            if (req.body.zoneName) data.zoneName = req.body.zoneName;
                            data.save()
                                .then((updated) => res.send({ status: 200, success: true, message: "Zone Updated Successfully", data: updated }))
                                .catch(() => res.send({ status: 422, success: false, message: "Zone not Updated" }));
                        }
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

const delZone = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    zoneModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Zone not Found" });
            } else {
                data.destroy()
                    .then(() => res.send({ status: 200, success: true, message: "Zone Deleted Successfully" }))
                    .catch(() => res.send({ status: 422, success: false, message: "Zone not Deleted " }));
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

    zoneModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Zone not Found" });
            } else {
                data.status = req.body.status;
                data.save()
                    .then((saved) => res.send({ status: 200, success: true, message: "Status Updated Successfully", data: saved }))
                    .catch(() => res.send({ status: 422, success: false, message: "Status Not Updated " }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

module.exports = { add, getAll, getSingle, update, delZone, changeStatus };