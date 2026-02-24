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

// Associations are now handled centrally in model files

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
                                    const safeEmp = employeeData.toJSON();
                                    const { password: userPass, ...safeUser } = newUserData.toJSON();
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Employee Register Successfully",
                                        employeeData: safeEmp,
                                        userData: safeUser
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
    // Whitelist allowed filter fields
    const body = req.body || {};
    const allowedFilters = {};
    if (body.storeId) allowedFilters.storeId = body.storeId;
    if (body.email) allowedFilters.email = body.email;
    if (body.status !== undefined) allowedFilters.status = body.status;
    if (body.designation) allowedFilters.designation = body.designation;

    console.log("GetAllEmployee Filters:", allowedFilters);

    employeeModel.findAll({
        where: allowedFilters,
        include: [
            {
                model: userModel,
                attributes: { exclude: ['password'] }
            }
        ]
    })
        .then(async (employeeData) => {
            if (employeeData.length == 0) {
                res.send({
                    status: 200,
                    success: true,
                    message: "No Employee Data Found",
                    data: []
                })
            }
            else {
                // Manual population of stores for JSON storeId
                const populatedData = await Promise.all(
                    employeeData.map(async (emp) => {
                        const empJson = emp.toJSON();
                        let ids = [];
                        if (Array.isArray(empJson.storeId)) {
                            ids = empJson.storeId;
                        } else if (empJson.storeId) {
                            try {
                                ids = typeof empJson.storeId === 'string' ? JSON.parse(empJson.storeId) : [empJson.storeId];
                            } catch (e) {
                                ids = [empJson.storeId];
                            }
                        }

                        if (ids.length > 0) {
                            empJson.storeId = await storeModel.findAll({
                                where: { id: { [Op.in]: ids } }
                            });
                        } else {
                            empJson.storeId = [];
                        }
                        return empJson;
                    })
                );

                res.send({
                    status: 200,
                    success: true,
                    message: "All Employee Data Found",
                    data: populatedData
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
                    const safeEmp = employeeData.toJSON();
                    res.send({
                        status: 200,
                        success: true,
                        message: "Employee Data Found",
                        data: safeEmp
                    })
                }
            })
            .catch((err) => {
                console.error("GetSingle Error:", err);
                res.status(422).send({
                    success: false,
                    message: "Something Went Wrong"
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
                                                    data: updatedData.toJSON(),
                                                    userData: userData.toJSON()
                                                });
                                            })
                                            .catch((err) => {
                                                console.error("User Update Error:", err);
                                                res.status(422).send({
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
                                                .then((savedUser) => {
                                                    res.send({
                                                        status: 200,
                                                        success: true,
                                                        message: "Status Updated Successfully",
                                                        employeeData: employeeData.toJSON(),
                                                        userData: savedUser.toJSON()
                                                    })
                                                })
                                                .catch((err) => {
                                                    console.error("User Status Update Error:", err);
                                                    res.status(422).send({
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