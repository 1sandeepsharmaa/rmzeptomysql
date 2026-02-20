const zonalCommercialModel = require("./zonalCommercialModel");
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
                    userType: 9,
                    designation: "Zonal_Commercial"
                };

                userModel.create(userPayload)
                    .then((newUserData) => {
                        const payload = {
                            userId: newUserData.id,
                            name: req.body.name,
                            storeId: req.body.storeId,
                            email: req.body.email,
                            contact: req.body.contact,
                            designation: "Zonal_Commercial",
                            empcode: generateEmployeeCode()
                        };

                        zonalCommercialModel.create(payload)
                            .then((data) => {
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "Zonal Commercial Register Successfully",
                                    employeeData: data,
                                    userData: newUserData
                                });
                            })
                            .catch((err) => {
                                console.error("ZonalCommercial Create Error:", err);
                                res.send({ status: 500, success: false, message: "Zonal Commercial Not Register!" });
                            });
                    })
                    .catch((err) => {
                        console.error("User Create Error:", err);
                        res.send({ status: 500, success: false, message: "Internal server error!!" });
                    });
            } else {
                res.send({ status: 422, success: false, message: "Zonal Commercial Already Exists" });
            }
        })
        .catch((err) => {
            console.error("User Find Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const getAll = (req, res) => {
    zonalCommercialModel.findAll({ where: req.body })
        .then((data) => {
            if (data.length == 0) {
                res.send({ status: 422, success: false, message: "No Zonal Commercial Data Found" });
            } else {
                res.send({ status: 200, success: true, message: "All Zonal Commercial Data Found", data: data });
            }
        })
        .catch((err) => {
            console.error("ZonalCommercial GetAll Error:", err);
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

    zonalCommercialModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Business Finance not Found" });
            } else {
                res.send({ status: 200, success: true, message: "Business Finance Data Found", data: data });
            }
        })
        .catch((err) => {
            console.error("ZonalCommercial GetSingle Error:", err);
            res.send({ status: 422, success: false, message: "Something Went Wrong" });
        });
};

const updateZonalCommercial = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    zonalCommercialModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Zonal Commercial not Found" });
            } else {
                if (req.body.name) data.name = req.body.name;
                if (req.body.contact) data.contact = req.body.contact;
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
                                res.send({ status: 200, success: true, message: "Updated Successfully", data: updated });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "User fetch error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Zonal Commercial not updated" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something went wrong" }));
};

const delZonalCommercial = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs });
    }

    zonalCommercialModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Zonal Commercial not Found" });
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
                    .catch(() => res.send({ status: 422, success: false, message: "Zonal Commercial Not Deleted!!" }));
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

    zonalCommercialModel.findOne({ where: { id: id } })
        .then((data) => {
            if (data == null) {
                res.send({ status: 422, success: false, message: "Zonal Commercial not Found" });
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
                                res.send({ status: 200, success: true, message: "Status Updated Successfully", zonalCommercialData: saved });
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error " }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

module.exports = { add, getAll, getSingle, updateZonalCommercial, delZonalCommercial, changeStatus };