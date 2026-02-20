const employeeModel = require("./employeeModel")
const userModel = require("../User/userModel")
const { uploadImg } = require("../../utilities/helper")
const bcrypt = require("bcrypt")

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
    if (!req.file) {
        errMsgs.push("picture is required")
    }
    if (!req.body.jobTitle) {
        errMsgs.push("jobTitle is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        userModel.findOne({ email: req.body.email })
            .then((userData) => {
                if (userData == null) {
                    let userObj = new userModel()
                    userObj.name = req.body.name
                    userObj.email = req.body.email
                    userObj.password = bcrypt.hashSync(req.body.password, 10)
                    userObj.userType = 2
                    userObj.save()
                        .then(async (newUserData) => {
                            let employeeObj = new employeeModel()
                            employeeObj.userId = newUserData._id
                            employeeObj.name = req.body.name
                            employeeObj.email = req.body.email
                            employeeObj.contact = req.body.contact
                            if (req.file) {
                                try {
                                    let url = await uploadImg(req.file.buffer)
                                    employeeObj.picture = url
                                }
                                catch (err) {
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "Cloudinary Error"
                                    })
                                }
                            }
                            employeeObj.experience = req.body.experience
                            employeeObj.jobTitle = req.body.jobTitle
                            employeeObj.joiningDate = req.body.joiningDate
                            employeeObj.save()
                                .then((employeeData) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Employee Register Successfully",
                                        employeeData: employeeData,
                                        userData: newUserData
                                    })
                                })
                                .catch(() => {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Employee Not Register!"
                                    })
                                })
                        })
                        .catch(() => {
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
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const getAll = (req, res) => {
    employeeModel.find(req.body)
        .populate("userId")
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
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            })
        })
}

const getSingle = (req, res) => {
    var errMsgs = []
    if (!req.body._id) {
        errMsgs.push("_id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        employeeModel.findOne({ _id: req.body._id })
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
                res.send({
                    status: 422,
                    success: false,
                    message: "Somehting Went Wrong"
                })
            })
    }
}

const update = (req, res) => {
    var errMsgs = []
    if (!req.body._id) {
        errMsgs.push("_id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        employeeModel.findOne({ _id: req.body._id })
            .then(async (employeeData) => {
                if (employeeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Employee not Found"
                    })
                }
                else {
                    if (req.body.name) {
                        employeeData.name = req.body.name
                    }
                    if (req.body.contact) {
                        employeeData.contact = req.body.contact
                    }
                    if (req.file) {
                        try {
                            let url = await uploadImg(req.file.buffer)
                            employeeData.picture = url
                        }
                        catch (err) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Cloudinary Error"
                            })
                        }
                    }
                    if (req.body.experience) {
                        employeeData.experience = req.body.experience
                    }
                    if (req.body.jobTitle) {
                        employeeData.jobTitle = req.body.jobTitle
                    }
                    if (req.body.joiningDate) {
                        employeeData.joiningDate = req.body.joiningDate
                    }
                    if (req.body.linkedin) {
                        employeeData.linkedin = req.body.linkedin
                    }
                    if (req.body.github) {
                        employeeData.github = req.body.github
                    }
                    if (req.body.userId) {
                        employeeData.userId = req.body.userId
                    }
                    employeeData.save()
                        .then((employeeData) => {
                            userModel.findOne({ _id: employeeData.userId })
                                .then((userData) => {
                                    if (userData == null) {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "User not Found"
                                        })
                                    }
                                    else {
                                        if (req.body.name) {
                                            userData.name = req.body.name
                                        }
                                        userData.save()
                                            .then(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Updated Successfully",
                                                    data: employeeData,
                                                    userData
                                                })
                                            })
                                            .catch(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Not Updated ",
                                                    data: employeeData
                                                })
                                            })
                                    }
                                })
                                .catch(() => {
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "Employee Data not Updated"
                                    })
                                })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Internal Server Error"
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

const delEmployee = (req, res) => {
    var errMsgs = []
    if (!req.body._id) {
        errMsgs.push("_id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        employeeModel.findOne({ _id: req.body._id })
            .then((employeeData) => {
                if (employeeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Employee not Found"
                    })
                }
                else {
                    employeeData.deleteOne()
                        .then(() => {
                            userModel.findOne({ _id: employeeData.userId })
                                .then((userData) => {
                                    if (userData == null) {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "User not Found"
                                        })
                                    }
                                    else {
                                        userData.deleteOne()
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

    if (!req.body._id) {
        errMsgs.push("_id is required")
    }
    // Check undefined instead of falsy
    if (typeof req.body.status === "undefined") {
        errMsgs.push("status is required")
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }

    employeeModel.findOne({ _id: req.body._id })
        .then((employeeData) => {
            if (!employeeData) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Employee not Found"
                })
            }

            employeeData.status = req.body.status
            employeeData.save()
                .then((employeeData) => {
                    userModel.findOne({ _id: employeeData.userId })
                        .then((userData) => {
                            if (!userData) {
                                return res.send({
                                    status: 422,
                                    success: false,
                                    message: "User not Found"
                                })
                            }

                            userData.status = req.body.status
                            userData.save()
                                .then((userData) => {
                                    return res.send({
                                        status: 200,
                                        success: true,
                                        message: "Status Updated Successfully",
                                        employeeData,
                                        userData
                                    })
                                })
                                .catch(() => {
                                    return res.send({
                                        status: 422,
                                        success: false,
                                        message: "Status Not Updated"
                                    })
                                })
                        })
                        .catch(() => {
                            return res.send({
                                status: 422,
                                success: false,
                                message: "Internal Server Error"
                            })
                        })
                })
                .catch(() => {
                    return res.send({
                        status: 422,
                        success: false,
                        message: "Internal Server Error"
                    })
                })
        })
        .catch(() => {
            return res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            })
        })
}


module.exports = { add, getAll, getSingle, update, delEmployee, changeStatus }