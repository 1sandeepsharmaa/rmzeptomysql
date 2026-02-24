const missingBridgeModel = require("./missingBridgeModel");
const userModel = require("../User/userModel");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const generateEmployeeCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const add = (req, res) => {
    var errMsgs = [];
    if (!req.body.name) errMsgs.push("name is required");
    if (!req.body.email) errMsgs.push("email is required");
    if (!req.body.password) errMsgs.push("password is required");
    if (!req.body.contact) errMsgs.push("contact is required");
    if (!req.body.zoneId) errMsgs.push("zoneId is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    userModel.findOne({ where: { email: req.body.email } })
        .then((userData) => {
            if (userData == null) {
                const userPayload = {
                    name: req.body.name,
                    email: req.body.email,
                    storeId: req.body.storeId,
                    password: bcrypt.hashSync(req.body.password, 10),
                    userType: 10,
                    designation: "Missing_Bridge"
                };

                userModel.create(userPayload)
                    .then((newUserData) => {
                        const mbPayload = {
                            userId: newUserData.id,
                            name: req.body.name,
                            storeId: req.body.storeId,
                            email: req.body.email,
                            contact: req.body.contact,
                            zoneId: req.body.zoneId,
                            designation: "Missing_Bridge",
                            empcode: generateEmployeeCode()
                        };

                        missingBridgeModel.create(mbPayload)
                            .then((mbData) => {
                                const safeMb = mbData.toJSON();
                                const { password: userPass, ...safeUser } = newUserData.toJSON();
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "Missing Bridge Register Successfully",
                                    employeeData: safeMb,
                                    userData: safeUser
                                });
                            })
                            .catch((err) => {
                                console.error("MB Create Error:", err);
                                res.send({ status: 500, success: false, message: "Missing Bridge Not Register!" });
                            });
                    })
                    .catch((err) => {
                        console.error("User Create Error:", err);
                        res.send({ status: 500, success: false, message: "Internal server error!!" });
                    });
            } else {
                res.send({ status: 422, success: false, message: "Missing Bridge Already Exists" });
            }
        })
        .catch((err) => {
            console.error("User Find Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const getAll = (req, res) => {
    // Whitelist allowed filter fields
    const body = req.body || {};
    const allowedFilters = {};
    if (body.storeId) allowedFilters.storeId = body.storeId;
    if (body.zoneId) allowedFilters.zoneId = body.zoneId;
    if (body.email) allowedFilters.email = body.email;
    if (body.status !== undefined) allowedFilters.status = body.status;

    console.log("GetAllMissingBridge Filters:", allowedFilters);

    missingBridgeModel.findAll({ where: allowedFilters })
        .then(async (mbData) => {
            if (mbData.length == 0) {
                res.send({ status: 200, success: true, message: "No Missing Bridge Data Found", data: [] });
            } else {
                const storeModel = require("../Store/storeModel");
                const populatedData = await Promise.all(
                    mbData.map(async (mb) => {
                        const mbJson = mb.toJSON();
                        let storeIds = [];
                        if (Array.isArray(mbJson.storeId)) {
                            storeIds = mbJson.storeId;
                        } else if (mbJson.storeId) {
                            try {
                                storeIds = typeof mbJson.storeId === 'string' ? JSON.parse(mbJson.storeId) : [mbJson.storeId];
                            } catch (e) {
                                storeIds = [mbJson.storeId];
                            }
                        }

                        if (storeIds.length > 0) {
                            mbJson.storeId = await storeModel.findAll({
                                where: { id: { [Op.in]: storeIds } }
                            });
                        } else {
                            mbJson.storeId = [];
                        }
                        return mbJson;
                    })
                );
                res.send({ status: 200, success: true, message: "All Missing Bridge Data Found", data: populatedData });
            }
        })
        .catch((err) => {
            console.error("MB GetAll Error:", err);
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

    missingBridgeModel.findOne({ where: { id: id } })
        .then((mbData) => {
            if (mbData == null) {
                res.send({ status: 422, success: false, message: "Missing Bridge not Found" });
            } else {
                res.send({ status: 200, success: true, message: "Missing Bridge Data Found", data: mbData.toJSON() });
            }
        })
        .catch((err) => {
            console.error("MB GetSingle Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const updateMissingBridge = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    missingBridgeModel.findOne({ where: { id: id } })
        .then((mbData) => {
            if (mbData == null) {
                res.send({ status: 422, success: false, message: "Missing Bridge not Found" });
            } else {
                if (req.body.name) mbData.name = req.body.name;
                if (req.body.contact) mbData.contact = req.body.contact;
                if (req.body.storeId) mbData.storeId = req.body.storeId;
                if (req.body.zoneId) mbData.zoneId = req.body.zoneId;

                mbData.save()
                    .then((updatedData) => {
                        userModel.findOne({ where: { id: updatedData.userId } })
                            .then((userData) => {
                                if (userData) {
                                    if (req.body.name) userData.name = req.body.name;
                                    if (req.body.storeId) userData.storeId = req.body.storeId;
                                    userData.save();
                                }
                                res.send({ status: 200, success: true, message: "Updated Successfully", data: updatedData.toJSON() });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "User fetch error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Missing Bridge not updated" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something went wrong" }));
};

const delMissingBridge = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    missingBridgeModel.findOne({ where: { id: id } })
        .then((mbData) => {
            if (mbData == null) {
                res.send({ status: 422, success: false, message: "Missing Bridge not Found" });
            } else {
                const userId = mbData.userId;
                mbData.destroy()
                    .then(() => {
                        userModel.findOne({ where: { id: userId } })
                            .then((userData) => {
                                if (userData) userData.destroy();
                                res.send({ status: 200, success: true, message: "Deleted Successfully" });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Missing Bridge Not Deleted!!" }));
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

    missingBridgeModel.findOne({ where: { id: id } })
        .then((mbData) => {
            if (mbData == null) {
                res.send({ status: 422, success: false, message: "Missing Bridge not Found" });
            } else {
                mbData.status = req.body.status;
                mbData.save()
                    .then((savedMbData) => {
                        userModel.findOne({ where: { id: savedMbData.userId } })
                            .then((userData) => {
                                if (userData) {
                                    userData.status = req.body.status;
                                    userData.save();
                                }
                                res.send({ status: 200, success: true, message: "Status Updated Successfully", missingBridgeData: savedMbData });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error " }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

module.exports = { add, getAll, getSingle, updateMissingBridge, delMissingBridge, changeStatus };