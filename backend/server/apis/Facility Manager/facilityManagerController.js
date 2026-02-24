const clmModel = require("../CLM/clmModel");
const bfModel = require("../Business Finance/businessFinanceModel");
const procurementModel = require("../Procurement/procureModel");
const zhModel = require("../Zonal Head/zonalHeadModel");
const fmModel = require("./facilityManagerModel");
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
                    password: bcrypt.hashSync(req.body.password, 10),
                    userType: 3,
                    storeId: req.body.storeId,
                    designation: "FM"
                };

                userModel.create(userPayload)
                    .then((newUserData) => {
                        const fmPayload = {
                            userId: newUserData.id,
                            name: req.body.name,
                            email: req.body.email,
                            contact: req.body.contact,
                            storeId: req.body.storeId,
                            designation: "FM",
                            empcode: generateEmployeeCode()
                        };

                        fmModel.create(fmPayload)
                            .then((fmData) => {
                                const safeFm = fmData.toJSON();
                                const { password: userPass, ...safeUser } = newUserData.toJSON();
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "FM Register Successfully",
                                    employeeData: safeFm,
                                    userData: safeUser
                                });
                            })
                            .catch((err) => {
                                console.error("FM Create Error:", err);
                                res.send({
                                    status: 500,
                                    success: false,
                                    message: "FM Not Register!"
                                });
                            });
                    })
                    .catch((err) => {
                        console.error("User Create Error:", err);
                        res.send({
                            status: 500,
                            success: false,
                            message: "Internal server error!!",
                        });
                    });
            } else {
                res.send({
                    status: 422,
                    success: false,
                    message: "FM Already Exists"
                });
            }
        })
        .catch((err) => {
            console.error("User Find Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};

const getAll = (req, res) => {
    // Whitelist allowed filter fields
    const body = req.body || {};
    const allowedFilters = {};
    if (body.storeId) allowedFilters.storeId = body.storeId;
    if (body.email) allowedFilters.email = body.email;
    if (body.status !== undefined) allowedFilters.status = body.status;

    console.log("GetAllFm Filters:", allowedFilters);

    fmModel.findAll({ where: allowedFilters })
        .then(async (fmData) => {
            if (fmData.length == 0) {
                res.send({ status: 200, success: true, message: "No FM Data Found", data: [] });
            } else {
                const storeModel = require("../Store/storeModel");
                // Manual population of stores
                const populatedData = await Promise.all(
                    fmData.map(async (fm) => {
                        const fmJson = fm.toJSON();
                        let storeIds = [];
                        if (Array.isArray(fmJson.storeId)) {
                            storeIds = fmJson.storeId;
                        } else if (fmJson.storeId) {
                            try {
                                storeIds = typeof fmJson.storeId === 'string' ? JSON.parse(fmJson.storeId) : [fmJson.storeId];
                            } catch (e) {
                                storeIds = [fmJson.storeId];
                            }
                        }

                        if (storeIds.length > 0) {
                            fmJson.storeId = await storeModel.findAll({
                                where: { id: { [Op.in]: storeIds } }
                            });
                        } else {
                            fmJson.storeId = [];
                        }
                        return fmJson;
                    })
                );
                console.log("Store GetAll Data Sample:", populatedData[0]);
                res.send({ status: 200, success: true, message: "All FM Data Found", data: populatedData });
            }
        })
        .catch((err) => {
            console.error("FM GetAll Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            });
        });
};

const getSingle = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    fmModel.findOne({ where: { id: id } })
        .then((fmData) => {
            if (fmData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Facility Manager not Found" // Fixed message
                });
            } else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Facility Manager Data Found", // Fixed message
                    data: fmData.toJSON()
                });
            }
        })
        .catch((err) => {
            console.error("FM GetSingle Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};

const updateFm = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    fmModel.findOne({ where: { id: id } })
        .then((fmData) => {
            if (fmData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "FM not Found"
                });
            } else {
                if (req.body.name) fmData.name = req.body.name;
                if (req.body.contact) fmData.contact = req.body.contact;
                if (req.body.storeId) fmData.storeId = req.body.storeId;

                fmData.save()
                    .then((updatedData) => {
                        userModel.findOne({ where: { id: updatedData.userId } })
                            .then((userData) => {
                                if (userData == null) {
                                    res.send({
                                        status: 200, // Partial success if FM is updated but user not found
                                        success: true,
                                        message: "Updated FM but User not found",
                                        data: updatedData
                                    });
                                } else {
                                    if (req.body.name) userData.name = req.body.name;
                                    // designation, email usually not updated here
                                    if (req.body.storeId) userData.storeId = req.body.storeId;

                                    userData.save()
                                        .then(() => {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Updated Successfully",
                                                data: updatedData.toJSON()
                                            });
                                        })
                                        .catch(() => {
                                            res.send({
                                                status: 422,
                                                success: false,
                                                message: "User not updated"
                                            });
                                        });
                                }
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "User fetch error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "FM not updated" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something went wrong" }));
};

const delfm = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    fmModel.findOne({ where: { id: id } })
        .then((fmData) => {
            if (fmData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Facility Manager not Found"
                });
            } else {
                const userId = fmData.userId;
                fmData.destroy()
                    .then(() => {
                        userModel.findOne({ where: { id: userId } })
                            .then((userData) => {
                                if (userData == null) {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Deleted Successfully (User not found)"
                                    });
                                } else {
                                    userData.destroy()
                                        .then(() => {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Deleted Successfully"
                                            });
                                        })
                                        .catch(() => res.send({ status: 422, success: false, message: "Not Deleted" }));
                                }
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Facility Manager Not Deleted!!" }));
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
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    fmModel.findOne({ where: { id: id } })
        .then((fmData) => {
            if (fmData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Facility Manager not Found"
                });
            } else {
                fmData.status = req.body.status;
                fmData.save()
                    .then((savedFmData) => {
                        userModel.findOne({ where: { id: savedFmData.userId } })
                            .then((userData) => {
                                if (userData == null) {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Status Updated Successfully (User not found)",
                                        fmData: savedFmData
                                    });
                                } else {
                                    userData.status = req.body.status;
                                    userData.save()
                                        .then((savedUserData) => {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Status Updated Successfully",
                                                fmData: savedFmData,
                                                userData: savedUserData
                                            });
                                        })
                                        .catch(() => res.send({ status: 422, success: false, message: "Status Not Updated " }));
                                }
                            })
                            .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error" }));
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Internal Server Error " }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something Went Wrong" }));
};

const changeDesignation = (req, res) => {
    var errMsgs = [];
    const id = req.body.id || req.body._id;
    if (!id) errMsgs.push("id is required");
    if (!req.body.oldDesignation) errMsgs.push("oldDesignation is required");
    if (!req.body.newDesignation) errMsgs.push("newDesignation is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    const designationModelMap = {
        FM: fmModel,
        CLM: clmModel,
        Zonal_Head: zhModel,
        Business_Finance: bfModel,
        Procurement: procurementModel
    };

    const OldModel = designationModelMap[req.body.oldDesignation];
    const NewModel = designationModelMap[req.body.newDesignation];

    if (!OldModel || !NewModel) {
        return res.send({
            status: 400,
            success: false,
            message: "Invalid designation"
        });
    }

    OldModel.findOne({ where: { id: id } })
        .then((oldData) => {
            if (oldData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Record not Found"
                });
            } else {
                const oldObj = oldData.get({ plain: true });
                oldData.destroy()
                    .then(() => {
                        oldObj.designation = req.body.newDesignation;
                        delete oldObj.id; // Remove primary key for creation in new model

                        NewModel.create(oldObj)
                            .then((newRecord) => {
                                userModel.findOne({ where: { id: oldObj.userId } })
                                    .then((userData) => {
                                        if (userData) {
                                            userData.designation = req.body.newDesignation;
                                            userData.save();
                                        }

                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Designation changed successfully",
                                            data: newRecord
                                        });
                                    })
                                    .catch(() => res.send({ status: 422, success: false, message: "User not Found" }));
                            })
                            .catch((err) => {
                                console.error("Designation Change Error:", err);
                                res.send({ status: 422, success: false, message: "New record not created" });
                            });
                    })
                    .catch(() => res.send({ status: 422, success: false, message: "Old record not deleted" }));
            }
        })
        .catch(() => res.send({ status: 422, success: false, message: "Something went wrong" }));
};

module.exports = { add, getAll, getSingle, updateFm, delfm, changeStatus, changeDesignation };