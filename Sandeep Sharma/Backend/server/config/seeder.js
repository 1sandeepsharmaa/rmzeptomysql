const userModel=require("../apis/User/userModel")
const bcrypt = require("bcrypt")

const adminReg = (req, res) => {
    userModel.findOne({ email: "admin@gmail.com" })
        .then((userData) => {
            if (userData == null) {
                let userObj = new userModel()
                userObj.name = "Admin"
                userObj.email = "admin@gmail.com"
                userObj.password = bcrypt.hashSync("admin@123", 10)
                userObj.userType = 1
                userObj.save()
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