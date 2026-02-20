const jwt = require("jsonwebtoken")
const secret = "722784&@@&*$"

module.exports = (req, res, next) => {
    let token = req.headers["authorization"]
    if (!token) {
        res.send({
            status: 422,
            success: false,
            message: "token is required"
        })
    }
    else {
        jwt.verify(token, secret, (err, data) => {
            if (!!err) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Inavalid token"
                })
            }
            else {
                if (data.userType == 1) {
                    req.decoded = data
                    next()
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Unauthorized Access"
                    })
                }
            }
        })
    }
}