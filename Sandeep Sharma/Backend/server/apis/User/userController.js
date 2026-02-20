const userModel = require("../User/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret = "722784&@@&*$"


const login = (req, res) => {
    var errMsgs = []
    if (!req.body.email) {
        errMsgs.push("email is required")
    }
    if (!req.body.password) {
        errMsgs.push("password is required")
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
                    res.send({
                        status: 422,
                        success: false,
                        message: "User not Found"
                    })
                }
                else {
                    bcrypt.compare(req.body.password, userData.password, function (err, ismatch) {
                        if (!ismatch) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Wrong Password"
                            })
                        }
                        else {
                            let payload = {
                                userId: userData._id,
                                name: userData.name,
                                email: userData.email,
                                userType: userData.userType
                            }
                            let token = jwt.sign(payload, secret)
                            res.send({
                                status: 200,
                                success: true,
                                message: "Login Successfully",
                                data: userData,
                                token: token
                            })
                        }
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
    userModel.find(req.body)
        .then((userData) => {
            if (userData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "No User Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "User Found",
                    data: userData
                })

            }
        })
        .catch(() => {
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
        userModel.findOne({ _id: req.body._id })
            .then((userData) => {
                if (userData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "User not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "User Found",
                        data: userData
                    })
                }
            })
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Somehting Went Wrong"
                })
            })
    }
}

const changePassword = (req, res) => {
    var errMsgs = []
    if (!req.body.oldpassword) {
        errMsgs.push("oldpassword is required")
    }
    if (!req.body.newpassword) {
        errMsgs.push("newpassword is required")
    }
    if (!req.body.confirmpassword) {
        errMsgs.push("confirmpassword is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        if (req.body.newpassword == req.body.confirmpassword) {
            userModel.findOne({ _id: req.decoded.userId })
                .then((userData) => {
                    bcrypt.compare(req.body.oldpassword, userData.password, function (err, ismatch) {
                        if (!ismatch) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "old password is Incorrect"
                            })
                        }
                        else {
                            userData.password = bcrypt.hashSync(req.body.newpassword, 10)
                            userData.save()
                                .then((updatedPass) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Password Updated Successfully",
                                        data: updatedPass
                                    })
                                })
                                .catch(() => {
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "Password Not updated"
                                    })
                                })
                        }
                    })
                })
                .catch(() => {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Something Went Wrong"
                    })
                })
        }
        else {
            res.send({
                status: 422,
                success: false,
                message: "New password and Confirm Password should be same!!"
            })
        }
    }
}
module.exports = { login ,getAll,getSingle,changePassword}