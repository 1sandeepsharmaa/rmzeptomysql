const userModel = require("../apis/User/userModel")
const bcrypt = require("bcrypt")

const adminReg = (req, res) => {
    userModel.findOne({ where: { email: "admin@gmail.com" } })
        .then((userData) => {
            if (userData == null) {
                const adminPayload = {
                    name: "Admin",
                    email: "admin@gmail.com",
                    password: bcrypt.hashSync("admin@123", 10),
                    userType: 1
                };
                userModel.create(adminPayload)
                    .then(() => {
                        console.log("Admin Added Successfully");
                    })
                    .catch((err) => {
                        console.log("Something Went Wrong", err);
                    })
            }
            else {
                console.log("Admin Already Exists");
            }
        })
        .catch((err) => {
            console.log("Something Went Wrong", err);
        })
}

const viewerReg = (req, res) => {
    userModel.findOne({ where: { email: "viewer@gmail.com" } })
        .then((userData) => {
            if (userData == null) {
                const viewerPayload = {
                    name: "Viewer",
                    email: "viewer@gmail.com",
                    password: bcrypt.hashSync("viewer@123", 10),
                    userType: 11
                };
                userModel.create(viewerPayload)
                    .then(() => {
                        console.log("Viewer Added Successfully");
                    })
                    .catch((err) => {
                        console.log("Something Went Wrong", err);
                    })
            }
            else {
                console.log("Viewer Already Exists");
            }
        })
        .catch((err) => {
            console.log("Something Went Wrong", err);
        })
}

module.exports = { adminReg, viewerReg }