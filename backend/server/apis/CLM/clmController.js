const clmModel = require("./clmModel")
const userModel = require("../User/userModel")
const bcrypt = require("bcrypt")
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
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("name is required")
    }
    if (!req.body.email) {
        errMsgs.push("email is required")
    }
    if (!req.body.password) {
        errMsgs.push("password is required")
    }
    if (!req.body.contact) {
        errMsgs.push("contact is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        userModel.findOne({ where: { email: req.body.email } })
            .then((userData) => {
                if (userData == null) {
                    const userPayload = {
                        name: req.body.name,
                        email: req.body.email,
                        storeId: req.body.storeId,
                        password: bcrypt.hashSync(req.body.password, 10),
                        userType: 4,
                        designation: "CLM"
                    };

                    userModel.create(userPayload)
                        .then((newUserData) => {
                            const clmPayload = {
                                userId: newUserData.id,
                                name: req.body.name,
                                storeId: req.body.storeId,
                                email: req.body.email,
                                contact: req.body.contact,
                                designation: "CLM",
                                empcode: generateEmployeeCode()
                            };

                            clmModel.create(clmPayload)
                                .then((clmData) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "CLM Register Successfully",
                                        employeeData: clmData,
                                        userData: newUserData
                                    })
                                })
                                .catch((err) => {
                                    console.error("CLM Register Error:", err);
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "CLM Not Register!"
                                    })
                                })
                        })
                        .catch((err) => {
                            console.error("CLM User Register Error:", err);
                            res.send({
                                status: 500,
                                success: false,
                                message: "Internel server error!!",
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "CLM Already Exists"
                    })
                }
            })
            .catch((err) => {
                console.error("CLM Check Email Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const getAll = (req, res) => {
    clmModel.findAll({ where: req.body })
        // .populate("userId").populate("storeId") 
        // Sequelize include logic would go here if associations are defined.
        .then((clmData) => {
            if (clmData.length == 0) {
                res.send({
                    status: 422,
                    success: false,
                    message: "No CLM Data Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "All CLM Data Found",
                    data: clmData
                })

            }
        })
        .catch((err) => {
            console.error("CLM GetAll Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            })
        })
}

const getSingle = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        const id = req.body.id || req.body._id;
        clmModel.findOne({ where: { id: id } })
            .then((clmData) => {
                if (clmData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "CLM not Found" // Fixed message from "Business Finance not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "CLM Data Found", // Fixed message
                        data: clmData
                    })
                }
            })
            .catch((err) => {
                console.error("CLM GetSingle Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Somehting Went Wrong"
                })
            })
    }
}

const updateClm = (req, res) => {
    var errMsgs = [];

    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required");
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    const id = req.body.id || req.body._id;

    clmModel.findOne({ where: { id: id } })
        .then((clmData) => {

            if (clmData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "CLM not Found"
                });
            }
            else {

                if (req.body.name) {
                    clmData.name = req.body.name;
                }
                if (req.body.contact) {
                    clmData.contact = req.body.contact;
                }
                if (req.body.storeId) {
                    clmData.storeId = req.body.storeId;
                }

                clmData.save()
                    .then((updatedData) => {

                        if (updatedData.userId) {
                            userModel.findOne({ where: { id: updatedData.userId } })
                                .then((userData) => {

                                    if (userData == null) {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "User not Found"
                                        });
                                    }
                                    else {

                                        if (req.body.name) {
                                            userData.name = req.body.name;
                                        }
                                        // userData.contact = req.body.contact; // User usually doesn't have contact in this schema? Original code had it.
                                        if (req.body.storeId) {
                                            userData.storeId = req.body.storeId;
                                        }

                                        userData.save()
                                            .then(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Updated Successfully",
                                                    data: updatedData
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
                                .catch(() => {
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "User fetch error"
                                    });
                                });
                        } else {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Updated Successfully",
                                data: updatedData
                            });
                        }
                    })
                    .catch(() => {
                        res.send({
                            status: 422,
                            success: false,
                            message: "CLM not updated"
                        });
                    });
            }
        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something went wrong"
            });
        });
};


const delclm = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        const id = req.body.id || req.body._id;
        clmModel.findOne({ where: { id: id } })
            .then((clmData) => {
                if (clmData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "CLM not Found"
                    })
                }
                else {
                    const userId = clmData.userId;
                    clmData.destroy()
                        .then(() => {
                            if (userId) {
                                userModel.findOne({ where: { id: userId } })
                                    .then((userData) => {
                                        if (userData == null) {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Deleted Successfully (User not found)"
                                            })
                                        }
                                        else {
                                            userData.destroy()
                                                .then(() => {
                                                    res.send({
                                                        status: 200,
                                                        success: true,
                                                        message: "Deleted Successfully"
                                                    })
                                                })
                                                .catch(() => {
                                                    res.send({
                                                        status: 422,
                                                        success: false,
                                                        message: "Not Deleted"
                                                    })
                                                })
                                        }
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Internal Server Error"
                                        })
                                    })
                            } else {
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "Deleted Successfully"
                                })
                            }
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "CLM Not Deleted!!"
                            })
                        })
                }
            })
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const changeStatus = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required")
    }
    if (req.body.status === undefined) {
        errMsgs.push("status is required")

    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        const id = req.body.id || req.body._id;
        clmModel.findOne({ where: { id: id } })
            .then((clmData) => {
                if (clmData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "CLM not Found"
                    })
                }
                else {
                    clmData.status = req.body.status
                    clmData.save()
                        .then((clmData) => {
                            if (clmData.userId) {
                                userModel.findOne({ where: { id: clmData.userId } })
                                    .then((userData) => {
                                        if (userData == null) {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Status Updated Successfully (User not found)",
                                                clmData
                                            })
                                        }
                                        else {
                                            userData.status = req.body.status
                                            userData.save()
                                                .then((userData) => {
                                                    res.send({
                                                        status: 200,
                                                        success: true,
                                                        message: "Status Updated Successfully",
                                                        clmData,
                                                        userData
                                                    })
                                                })
                                                .catch(() => {
                                                    res.send({
                                                        status: 422,
                                                        success: false,
                                                        message: "Status Not Updated "
                                                    })
                                                })
                                        }
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Internal Server Error"
                                        })
                                    })
                            } else {
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "Status Updated Successfully",
                                    clmData
                                })
                            }
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Internal Server Error "
                            })
                        })
                }
            })
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}


module.exports = { add, getAll, getSingle, updateClm, delclm, changeStatus }