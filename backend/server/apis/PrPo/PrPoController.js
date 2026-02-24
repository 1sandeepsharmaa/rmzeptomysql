const prpoModel = require("./PrPoModel");
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

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    userModel.findOne({ where: { email: req.body.email } })
        .then((userData) => {
            if (userData == null) {
                const userPayload = {
                    name: req.body.name,
                    email: req.body.email,
                    storeId: req.body.storeId, // Expected to be handled by associations later
                    password: bcrypt.hashSync(req.body.password, 10),
                    userType: 8,
                    designation: "PR/PO"
                };

                userModel.create(userPayload)
                    .then((newUserData) => {
                        const prpoPayload = {
                            userId: newUserData.id,
                            name: req.body.name,
                            storeId: req.body.storeId,
                            email: req.body.email,
                            contact: req.body.contact,
                            designation: "PR/PO",
                            empcode: generateEmployeeCode()
                        };

                        prpoModel.create(prpoPayload)
                            .then((prpoData) => {
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "PR/PO Register Successfully",
                                    employeeData: prpoData,
                                    userData: newUserData
                                });
                            })
                            .catch((err) => {
                                console.error("PR/PO Create Error:", err);
                                res.send({ status: 500, success: false, message: "PR/PO Not Register!" });
                            });
                    })
                    .catch((err) => {
                        console.error("User Create Error:", err);
                        res.send({ status: 500, success: false, message: "Internal server error!!" });
                    });
            } else {
                res.send({ status: 422, success: false, message: "PR/PO Already Exists" });
            }
        })
        .catch((err) => {
            console.error("User Find Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const getAll = (req, res) => {
    prpoModel.findAll({ where: req.body })
        .then(async (data) => {
            if (data.length == 0) {
                res.send({ status: 200, success: true, message: "No Data Found", data: [] });
            } else {
                const storeModel = require("../Store/storeModel");
                const populatedData = await Promise.all(
                    data.map(async (p) => {
                        const pJson = p.toJSON();
                        let storeIds = [];
                        if (Array.isArray(pJson.storeId)) {
                            storeIds = pJson.storeId;
                        } else if (pJson.storeId) {
                            storeIds = [pJson.storeId];
                        }

                        if (storeIds.length > 0) {
                            pJson.storeId = await storeModel.findAll({
                                where: { id: { [Op.in]: storeIds } }
                            });
                        } else {
                            pJson.storeId = [];
                        }
                        return pJson;
                    })
                );
                res.send({ status: 200, success: true, message: "All Data Found", data: populatedData });
            }
        })
        .catch((err) => {
            console.error("PR/PO GetAll Error:", err);
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

    prpoModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "PR/PO not Found" });
            } else {
                res.send({ status: 200, success: true, message: "PR/PO Data Found", data: data });
            }
        })
        .catch((err) => {
            console.error("PR/PO GetSingle Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const updatePrPo = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    prpoModel.findOne({ where: { id: id } })
        .then((prpoData) => {
            if (prpoData == null) {
                res.send({ status: 422, success: false, message: "PR/PO not Found" });
            } else {
                if (req.body.name) prpoData.name = req.body.name;
                if (req.body.contact) prpoData.contact = req.body.contact;
                if (req.body.storeId) prpoData.storeId = req.body.storeId;

                prpoData.save()
                    .then((updatedData) => {
                        userModel.findOne({ where: { id: updatedData.userId } })
                            .then((userData) => {
                                if (userData) {
                                    if (req.body.name) userData.name = req.body.name;
                                    if (req.body.storeId) userData.storeId = req.body.storeId;
                                    userData.save();
                                }
                                res.send({ status: 200, success: true, message: "Updated Successfully", data: updatedData });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "User fetch error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "PR/PO not updated" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something went wrong" }));
};

const delPrPo = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    prpoModel.findOne({ where: { id: id } })
        .then((prpoData) => {
            if (prpoData == null) {
                res.send({ status: 422, success: false, message: "PR/PO not Found" });
            } else {
                const userId = prpoData.userId;
                prpoData.destroy()
                    .then(() => {
                        userModel.findOne({ where: { id: userId } })
                            .then((userData) => {
                                if (userData) userData.destroy();
                                res.send({ status: 200, success: true, message: "Deleted Successfully" });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "PR/PO Not Deleted!!" }));
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

    prpoModel.findOne({ where: { id: id } })
        .then((prpoData) => {
            if (prpoData == null) {
                res.send({ status: 422, success: false, message: "PR/PO not Found" });
            } else {
                prpoData.status = req.body.status;
                prpoData.save()
                    .then((savedPrPoData) => {
                        userModel.findOne({ where: { id: savedPrPoData.userId } })
                            .then((userData) => {
                                if (userData) {
                                    userData.status = req.body.status;
                                    userData.save();
                                }
                                res.send({ status: 200, success: true, message: "Status Updated Successfully", prpoModelData: savedPrPoData });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error " }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

module.exports = { add, getAll, getSingle, updatePrPo, delPrPo, changeStatus };