const userModel = require("../User/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secret = process.env.JWT_SECRET || "123@#"

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
                            let token = jwt.sign(payload, secret, { expiresIn: "8h" })
                            const { password, ...safeUser } = userData.toJSON();
                            res.send({
                                status: 200,
                                success: true,
                                message: "Login Successfully",
                                data: safeUser,
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
    // Only allow safe, explicit filter fields
    const allowedFilters = {};
    if (req.body.userType !== undefined) allowedFilters.userType = req.body.userType;
    if (req.body.email !== undefined) allowedFilters.email = req.body.email;
    if (req.body.status !== undefined) allowedFilters.status = req.body.status;

    userModel.findAll({
        where: allowedFilters,
        attributes: { exclude: ['password'] }
    })
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
        userModel.findOne({
            where: { id: searchId },
            attributes: { exclude: ['password'] }
        })
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

    // Authorization: Only own user or Admin (userType 1) can change password
    if (req.decoded.userId !== Number(searchId) && req.decoded.userType !== 1) {
        return res.send({
            status: 403,
            success: false,
            message: "Unauthorized: You can only change your own password."
        });
    }

    userModel.findOne({ where: { id: searchId } })
        .then((userData) => {
            if (!userData) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "User Not Found"
                })
            }

            // Verify old password
            bcrypt.compare(req.body.oldpassword, userData.password, (err, isMatch) => {
                if (!isMatch) {
                    return res.send({
                        status: 422,
                        success: false,
                        message: "Old password is incorrect"
                    });
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
            });
        })
        .catch((err) => {
            console.error("Change Password Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something went wrong"
            })
        })
}


const googleSsoLogin = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.send({ status: 422, success: false, message: "idToken is required" });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload['email'];

        // Verify if user exists (Admin approved constraint)
        const user = await userModel.findOne({ where: { email: email } });
        if (!user) {
            return res.send({
                status: 401,
                success: false,
                message: "This account is not authorized by Admin. Please contact Admin to register."
            });
        }

        // Check user status
        if (!user.status) {
            return res.send({
                status: 403,
                success: false,
                message: "Your account is disabled. Please contact Admin."
            });
        }

        // Generate JWT
        const jwtPayload = {
            userId: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType
        };
        const token = jwt.sign(jwtPayload, secret, { expiresIn: "8h" });
        const { password, ...safeUser } = user.toJSON();

        res.send({
            status: 200,
            success: true,
            message: "Login Successfully via Google",
            data: safeUser,
            token: token
        });

    } catch (err) {
        console.error("Google SSO Error:", err);
        res.send({
            status: 401,
            success: false,
            message: "Invalid Google Token"
        });
    }
}

module.exports = { login, getAll, getSingle, changePassword, googleSsoLogin }