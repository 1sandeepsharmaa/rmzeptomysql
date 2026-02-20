const userModel = require("../User/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret = "123@#"

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
        userModel.findOne({ where: { email: req.body.email } })
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
                                userId: userData.id, // Changed from _id to id
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
            .catch((err) => {
                console.error("Login Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const getAll = (req, res) => {
    // Careful: req.body might need filtering, but passing directly for now as per logic
    userModel.findAll({ where: req.body })
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
        .catch((err) => {
            console.error("GetAll Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            })
        })
}

const getSingle = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) { // Checking both for compatibility
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
        // Support both id (Sequelize) and _id (Legacy Frontend)
        const searchId = req.body.id || req.body._id;
        userModel.findOne({ where: { id: searchId } })
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
            .catch((err) => {
                console.error("GetSingle Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}


const changePassword = (req, res) => {
    let errMsgs = []
    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required")
    }
    if (!req.body.newpassword) {
        errMsgs.push("newpassword is required")
    }
    if (!req.body.confirmpassword) {
        errMsgs.push("confirmpassword is required")
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }

    if (req.body.newpassword !== req.body.confirmpassword) {
        return res.send({
            status: 422,
            success: false,
            message: "New password and Confirm password should be same"
        })
    }

    const searchId = req.body.id || req.body._id;

    userModel.findOne({ where: { id: searchId } })
        .then((userData) => {
            if (!userData) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "User Not Found"
                })
            }
            userData.password = bcrypt.hashSync(req.body.newpassword, 10)

            userData.save()
                .then(() => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Password Updated Successfully"
                    })
                })
                .catch((err) => {
                    console.error("Save Password Error:", err);
                    res.send({
                        status: 422,
                        success: false,
                        message: "Password Not Updated"
                    })
                })
        })
        .catch((err) => {
            console.error("Change Password Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "User Not Found" // Code flow ends up here usually on DB error
            })
        })
}


module.exports = { login, getAll, getSingle, changePassword }