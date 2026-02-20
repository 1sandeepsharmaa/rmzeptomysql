const procureModel = require("./procureModel");
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
                    storeId: req.body.storeId,
                    password: bcrypt.hashSync(req.body.password, 10),
                    userType: 7,
                    designation: "Procurement"
                };

                userModel.create(userPayload)
                    .then((newUserData) => {
                        const procurePayload = {
                            userId: newUserData.id,
                            name: req.body.name,
                            email: req.body.email,
                            storeId: req.body.storeId,
                            contact: req.body.contact,
                            designation: "Procurement",
                            empcode: generateEmployeeCode()
                        };

                        procureModel.create(procurePayload)
                            .then((procureData) => {
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "Procurement Register Successfully",
                                    employeeData: procureData,
                                    userData: newUserData
                                });
                            })
                            .catch((err) => {
                                console.error("Procurement Create Error:", err);
                                res.send({ status: 500, success: false, message: "Procurement Not Register!" });
                            });
                    })
                    .catch((err) => {
                        console.error("User Create Error:", err);
                        res.send({ status: 500, success: false, message: "Internal server error!!" });
                    });
            } else {
                res.send({ status: 422, success: false, message: "Procurement Already Exists" });
            }
        })
        .catch((err) => {
            console.error("User Find Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const getAll = (req, res) => {
    procureModel.findAll({ where: req.body })
        .then((data) => {
            if (data.length == 0) {
                res.send({ status: 422, success: false, message: "No procure Data Found" });
            } else {
                res.send({ status: 200, success: true, message: "All procure Data Found", data: data });
            }
        })
        .catch((err) => {
            console.error("Procurement GetAll Error:", err);
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

    procureModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Business Finance not Found" }); // Keeping legacy message context
            } else {
                res.send({ status: 200, success: true, message: "Business Finance Data Found", data: data });
            }
        })
        .catch((err) => {
            console.error("Procurement GetSingle Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const updatePr = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    procureModel.findOne({ where: { id: id } })
        .then((procureData) => {
            if (procureData == null) {
                res.send({ status: 422, success: false, message: "Procurement not Found" });
            } else {
                if (req.body.name) procureData.name = req.body.name;
                if (req.body.contact) procureData.contact = req.body.contact;
                if (req.body.storeId) procureData.storeId = req.body.storeId;

                procureData.save()
                    .then((updatedData) => {
                        userModel.findOne({ where: { id: updatedData.userId } })
                            .then((userData) => {
                                if (userData) {
                                    if (req.body.name) userData.name = req.body.name;
                                    if (req.body.contact) userData.contact = req.body.contact;
                                    if (req.body.storeId) userData.storeId = req.body.storeId;
                                    userData.save();
                                }
                                res.send({ status: 200, success: true, message: "Updated Successfully", data: updatedData });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "User fetch error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Procurement not updated" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something went wrong" }));
};

const delprocure = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    procureModel.findOne({ where: { id: id } })
        .then((procureData) => {
            if (procureData == null) {
                res.send({ status: 422, success: false, message: "procure not Found" });
            } else {
                const userId = procureData.userId;
                procureData.destroy()
                    .then(() => {
                        userModel.findOne({ where: { id: userId } })
                            .then((userData) => {
                                if (userData) userData.destroy();
                                res.send({ status: 200, success: true, message: "Deleted Successfully" });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "procure Not Deleted!!" }));
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

    procureModel.findOne({ where: { id: id } })
        .then((procureData) => {
            if (procureData == null) {
                res.send({ status: 422, success: false, message: "procure not Found" });
            } else {
                procureData.status = req.body.status;
                procureData.save()
                    .then((savedData) => {
                        userModel.findOne({ where: { id: savedData.userId } })
                            .then((userData) => {
                                if (userData) {
                                    userData.status = req.body.status;
                                    userData.save();
                                }
                                res.send({ status: 200, success: true, message: "Status Updated Successfully", procureData: savedData });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error " }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

module.exports = { add, getAll, getSingle, updatePr, delprocure, changeStatus };