const bfModel = require("./businessFinanceModel")
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
                        password: bcrypt.hashSync(req.body.password, 10),
                        userType: 6,
                        designation: "Business_Finance"
                    };

                    userModel.create(userPayload)
                        .then((newUserData) => {
                            const bfPayload = {
                                userId: newUserData.id,
                                name: req.body.name,
                                email: req.body.email,
                                storeId: req.body.storeId, // Sequelize model handles integer/string conversion if type matches
                                contact: req.body.contact,
                                designation: "Business_Finance",
                                empcode: generateEmployeeCode()
                            };

                            bfModel.create(bfPayload)
                                .then((bfData) => {
                                    const safeBf = bfData.toJSON();
                                    const { password: userPass, ...safeUser } = newUserData.toJSON();
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Business Finance Register Successfully",
                                        employeeData: safeBf,
                                        userData: safeUser
                                    })
                                })
                                .catch((err) => {
                                    console.error("BF Register Error:", err);
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Business Finance Not Register!"
                                    })
                                })
                        })
                        .catch((err) => {
                            console.error("BF User Register Error:", err);
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
                        message: "Business Finance Already Exists"
                    })
                }
            })
            .catch((err) => {
                console.error("BF Check Email Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const getAll = (req, res) => {
    // Whitelist allowed filter fields
    const body = req.body || {};
    const allowedFilters = {};
    if (body.storeId) allowedFilters.storeId = body.storeId;
    if (body.status !== undefined) allowedFilters.status = body.status;

    console.log("GetAllBf Filters:", allowedFilters);

    bfModel.findAll({ where: allowedFilters })
        .then(async (data) => {
            if (data.length == 0) {
                res.send({ status: 200, success: true, message: "No Manager Data Found", data: [] });
            } else {
                const storeModel = require("../Store/storeModel");
                const populatedData = await Promise.all(
                    data.map(async (bf) => {
                        const bfJson = bf.toJSON();
                        let storeIds = [];
                        if (Array.isArray(bfJson.storeId)) {
                            storeIds = bfJson.storeId;
                        } else if (bfJson.storeId) {
                            try {
                                storeIds = typeof bfJson.storeId === 'string' ? JSON.parse(bfJson.storeId) : [bfJson.storeId];
                            } catch (e) {
                                storeIds = [bfJson.storeId];
                            }
                        }

                        if (storeIds.length > 0) {
                            bfJson.storeId = await storeModel.findAll({
                                where: { id: { [Op.in]: storeIds } }
                            });
                        } else {
                            bfJson.storeId = [];
                        }
                        return bfJson;
                    })
                );
                res.send({ status: 200, success: true, message: "All Manager Data Found", data: populatedData });
            }
        })
        .catch((err) => {
            console.error("BF GetAll Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            });
        });
};

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
        bfModel.findOne({ where: { id: id } })
            .then((bfData) => {
                if (bfData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Business Finance not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Business Finance Data Found",
                        data: bfData.toJSON()
                    })
                }
            })
            .catch((err) => {
                console.error("BF GetSingle Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Somehting Went Wrong"
                })
            })
    }
}


const updateBf = (req, res) => {
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

    bfModel.findOne({ where: { id: id } })
        .then((bfData) => {

            if (bfData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Business Finance not Found"
                });
            }
            else {
                if (req.body.name) {
                    bfData.name = req.body.name;
                }
                if (req.body.contact) {
                    bfData.contact = req.body.contact;
                }
                if (req.body.storeId) {
                    bfData.storeId = req.body.storeId;
                }
                bfData.save()
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
                                        // User model update for contact/storeId if exists in schema
                                        // userData.contact = req.body.contact; // User model usually doesn't have contact

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
                            message: "Business Finanace not updated"
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

const delbf = (req, res) => {
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
        bfModel.findOne({ where: { id: id } })
            .then((bfData) => {
                if (bfData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Business finance not Found"
                    })
                }
                else {
                    const userId = bfData.userId;
                    bfData.destroy()
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
                                                        message: "User Not Deleted"
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
                                message: "Business finance Not Deleted!!"
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
        bfModel.findOne({ where: { id: id } }) // Using bfModel instead of employeeModel in error
            .then((bfData) => {
                if (bfData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Business Finance not Found"
                    })
                }
                else {
                    bfData.status = req.body.status
                    bfData.save()
                        .then((bfData) => {
                            if (bfData.userId) {
                                userModel.findOne({ where: { id: bfData.userId } })
                                    .then((userData) => {
                                        if (userData == null) {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Status Updated Successfully (User not found)",
                                                employeeData: bfData
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
                                                        employeeData: bfData,
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
                                    employeeData: bfData
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


module.exports = { add, getAll, getSingle, updateBf, delbf, changeStatus }