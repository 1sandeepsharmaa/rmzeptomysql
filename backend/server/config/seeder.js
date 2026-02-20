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

module.exports = { adminReg }