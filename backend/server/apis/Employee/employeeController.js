const employeeModel = require("./employeeModel")
const fmModel = require("../Facility Manager/facilityManagerModel")
const clmModel = require("../CLM/clmModel")
const bfModel = require("../Business Finance/businessFinanceModel")
const procurementModel = require("../Procurement/procureModel")
const zhModel = require("../Zonal Head/zonalHeadModel")
const userModel = require("../User/userModel")
// Need Store model for association if we want to include it
const storeModel = require("../Store/storeModel");

const bcrypt = require("bcrypt")
const { Op } = require("sequelize");

// Define Associations locally for this controller's needs (or move to a central model loader)
// Ideally these should be in a central init file, but doing here to keep it working as per current structure
// We check if associations are already defined to avoid overwriting warnings if reloaded
if (!employeeModel.associations.User) {
    employeeModel.belongsTo(userModel, { foreignKey: 'userId' });
}
if (!employeeModel.associations.Store) {
    employeeModel.belongsTo(storeModel, { foreignKey: 'storeId' });
}
if (!userModel.associations.Employee) {
    userModel.hasOne(employeeModel, { foreignKey: 'userId' });
}

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
                    // Create User
                    const userPayload = {
                        name: req.body.name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, 10),
                        userType: 2,
                        designation: "Employee"
                    };

                    userModel.create(userPayload)
                        .then((newUserData) => {
                            // Create Employee
                            const employeePayload = {
                                userId: newUserData.id,
                                name: req.body.name,
                                storeId: req.body.storeId,
                                email: req.body.email,
                                contact: req.body.contact,
                                empcode: generateEmployeeCode(),
                                designation: "Employee"
                            };

                            employeeModel.create(employeePayload)
                                .then((employeeData) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Employee Register Successfully",
                                        employeeData: employeeData,
                                        userData: newUserData
                                    })
                                })
                                .catch((err) => {
                                    console.error("Employee Create Error:", err);
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Employee Not Register!"
                                    })
                                })
                        })
                        .catch((err) => {
                            console.error("User Create Error:", err);
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
                        message: "Employee Already Exists"
                    })
                }
            })
            .catch((err) => {
                console.error("Check Email Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const getAll = (req, res) => {
    // req.body used for filtering. ensure valid columns.
    // Clean up req.body to remove non-model fields if necessary, or let Sequelize ignore/error
    employeeModel.findAll({
        where: req.body,
        include: [
            { model: userModel },
            { model: storeModel }
        ]
    })
        .then((employeeData) => {
            if (employeeData.length == 0) {
                res.send({
                    status: 422,
                    success: false,
                    message: "No Employee Data Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "All Employee Data Found",
                    data: employeeData
                })

            }
        })
        .catch((err) => {
            console.error("GetAll Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
                Error: err
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
        const searchId = req.body.id || req.body._id;
        employeeModel.findOne({
            where: { id: searchId },
            include: [{ model: storeModel }]
        })
            .then((employeeData) => {
                if (employeeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Employee not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Employee Data Found",
                        data: employeeData
                    })
                }
            })
            .catch((err) => {
                console.error("GetSingle Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Somehting Went Wrong"
                })
            })
    }
}

const updateEmp = (req, res) => {
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

    const searchId = req.body.id || req.body._id;

    employeeModel.findOne({ where: { id: searchId } })
        .then((employeeData) => {

            if (employeeData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Employee not Found"
                });
            }
            else {
                if (req.body.name) {
                    employeeData.name = req.body.name;
                }
                if (req.body.contact) {
                    employeeData.contact = req.body.contact;
                }
                if (req.body.storeId) {
                    employeeData.storeId = req.body.storeId;
                }
                employeeData.save()
                    .then((updatedData) => {
                        if (updatedData.userId) {
                            userModel.findOne({ where: { id: updatedData.userId } })
                                .then((userData) => {

                                    if (userData == null) {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Updated Successfully (User not found)",
                                            data: updatedData
                                        });
                                    }
                                    else {

                                        if (req.body.name) {
                                            userData.name = req.body.name;
                                        }
                                        // User model doesn't strictly have contact, checking if commonly added or not.
                                        // If it's not a column, Sequelize might throw error or ignore depending on options.
                                        // Safest is to only update if column exists or wrap in try/catch.
                                        // For now, removing contact update from user to correspond with User model definition.

                                        userData.save()
                                            .then(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Updated Successfully",
                                                    data: updatedData,
                                                    userData
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
                            message: "Employee not updated"
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

const delEmployee = (req, res) => {
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
        const searchId = req.body.id || req.body._id;
        employeeModel.findOne({ where: { id: searchId } })
            .then((employeeData) => {
                if (employeeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Employee not Found"
                    })
                }
                else {
                    const userId = employeeData.userId;
                    employeeData.destroy()
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
                                message: "Employee Not Deleted!!"
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
        const searchId = req.body.id || req.body._id;
        employeeModel.findOne({ where: { id: searchId } })
            .then((employeeData) => {
                if (employeeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Employee not Found"
                    })
                }
                else {
                    employeeData.status = req.body.status
                    employeeData.save()
                        .then((employeeData) => {
                            if (employeeData.userId) {
                                userModel.findOne({ where: { id: employeeData.userId } })
                                    .then((userData) => {
                                        if (userData == null) {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Status Updated Successfully (User not found)",
                                                employeeData
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
                                                        employeeData,
                                                        userData
                                                    })
                                                })
                                                .catch(() => {
                                                    res.send({
                                                        status: 422,
                                                        success: false,
                                                        message: "User Status Not Updated "
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
                                    employeeData
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

module.exports = { add, getAll, getSingle, updateEmp, delEmployee, changeStatus }