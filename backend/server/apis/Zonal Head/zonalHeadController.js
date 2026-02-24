const zhModel = require("./zonalHeadModel");
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
    if (!req.body.zoneId) errMsgs.push("zoneId is required");
    if (!req.body.contact) errMsgs.push("contact is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    userModel.findOne({ where: { email: req.body.email } })
        .then((userData) => {
            if (userData == null) {
                const userPayload = {
                    name: req.body.name,
                    email: req.body.email,
                    storeId: req.body.storeId,
                    password: bcrypt.hashSync(req.body.password, 10),
                    userType: 5,
                    designation: "Zonal_Head"
                };

                userModel.create(userPayload)
                    .then((newUserData) => {
                        const payload = {
                            userId: newUserData.id,
                            name: req.body.name,
                            email: req.body.email,
                            storeId: req.body.storeId,
                            contact: req.body.contact,
                            zoneId: req.body.zoneId,
                            designation: "Zonal_Head",
                            empcode: generateEmployeeCode()
                        };

                        zhModel.create(payload)
                            .then((zhData) => {
                                const safeZh = zhData.toJSON();
                                const { password: userPass, ...safeUser } = newUserData.toJSON();
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "Zonal Head Register Successfully",
                                    employeeData: safeZh,
                                    userData: safeUser
                                });
                            })
                            .catch((err) => {
                                console.error("ZonalHead Create Error:", err);
                                res.send({ status: 500, success: false, message: "Zonal Head Not Register!" });
                            });
                    })
                    .catch((err) => {
                        console.error("User Create Error:", err);
                        res.send({ status: 500, success: false, message: "Internal server error!!" });
                    });
            } else {
                res.send({ status: 422, success: false, message: "Zonal Head Already Exists" });
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
    if (body.email) allowedFilters.email = body.email;
    if (body.status !== undefined) allowedFilters.status = body.status;

    console.log("GetAllZh Filters:", allowedFilters);

    zhModel.findAll({ where: allowedFilters })
        .then(async (data) => {
            if (data.length == 0) {
                res.send({ status: 200, success: true, message: "No Manager Data Found", data: [] });
            } else {
                const storeModel = require("../Store/storeModel");
                const populatedData = await Promise.all(
                    data.map(async (zh) => {
                        const zhJson = zh.toJSON();
                        let storeIds = [];
                        if (Array.isArray(zhJson.storeId)) {
                            storeIds = zhJson.storeId;
                        } else if (zhJson.storeId) {
                            try {
                                storeIds = typeof zhJson.storeId === 'string' ? JSON.parse(zhJson.storeId) : [zhJson.storeId];
                            } catch (e) {
                                storeIds = [zhJson.storeId];
                            }
                        }

                        if (storeIds.length > 0) {
                            zhJson.storeId = await storeModel.findAll({
                                where: { id: { [Op.in]: storeIds } }
                            });
                        } else {
                            zhJson.storeId = [];
                        }
                        return zhJson;
                    })
                );
                res.send({ status: 200, success: true, message: "All Manager Data Found", data: populatedData });
            }
        })
        .catch((err) => {
            console.error("ZonalHead GetAll Error:", err);
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

    zhModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Business Finance not Found" });
            } else {
                res.send({ status: 200, success: true, message: "Business Finance Data Found", data: data.toJSON() });
            }
        })
        .catch((err) => {
            console.error("ZonalHead GetSingle Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const updateZh = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    zhModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Zonal Head not Found" });
            } else {
                if (req.body.name) data.name = req.body.name;
                if (req.body.contact) data.contact = req.body.contact;
                if (req.body.zoneId) data.zoneId = req.body.zoneId;
                if (req.body.storeId) data.storeId = req.body.storeId;

                data.save()
                    .then((updated) => {
                        userModel.findOne({ where: { id: updated.userId } })
                            .then((userData) => {
                                if (userData) {
                                    if (req.body.name) userData.name = req.body.name;
                                    if (req.body.contact) userData.contact = req.body.contact;
                                    if (req.body.storeId) userData.storeId = req.body.storeId;
                                    userData.save();
                                }
                                res.send({ status: 200, success: true, message: "Updated Successfully", data: updated.toJSON() });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "User fetch error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Zonal Head not updated" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something went wrong" }));
};

const delzh = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    zhModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Zonal Head not Found" });
            } else {
                const userId = data.userId;
                data.destroy()
                    .then(() => {
                        userModel.findOne({ where: { id: userId } })
                            .then((userData) => {
                                if (userData) userData.destroy();
                                res.send({ status: 200, success: true, message: "Deleted Successfully" });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Zonal Head Not Deleted!!" }));
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

    zhModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Zonal Head not Found" });
            } else {
                data.status = req.body.status;
                data.save()
                    .then((saved) => {
                        userModel.findOne({ where: { id: saved.userId } })
                            .then((userData) => {
                                if (userData) {
                                    userData.status = req.body.status;
                                    userData.save();
                                }
                                res.send({ status: 200, success: true, message: "Status Updated Successfully", zhData: saved });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error " }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

module.exports = { add, getAll, getSingle, updateZh, delzh, changeStatus };