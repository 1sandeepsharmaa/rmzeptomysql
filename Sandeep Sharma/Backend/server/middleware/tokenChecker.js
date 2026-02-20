const jwt = require("jsonwebtoken")
const secret = "722784&@@&*$"

module.exports = (req, res,next) => {
    let token = req.headers["authorization"]
    if (!token) {
        res.send({
            status: 422,
            success: false,
            message: "token in required"
        })
    }
    else {
        jwt.verify(token, secret, (err, data) => {
            if (!!err) {
                res.send({
                    status: 401,
                    success: false,
                    message: "Inavlid token"
                })
            }
            else{
                req.decoded=data
                next()
            }
        })
    }
}