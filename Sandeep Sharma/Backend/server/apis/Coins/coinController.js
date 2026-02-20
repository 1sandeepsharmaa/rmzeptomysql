const coinModel = require("./coinModel")
const employeeModel = require("../Employee/employeeModel")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.userId) {
        errMsgs.push("userId is required")
    }
    if (!req.body.taskId) {
        errMsgs.push("taskId is required")
    }
    if (!req.body.message) {
        errMsgs.push("message is required")
    }
    if (!req.body.coinCount) {
        errMsgs.push("coinCount is required")
    }
    if (!req.body.type) {
        errMsgs.push("type is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        coinModel.findOne({ taskId: req.body.taskId, userId: req.body.userId })
            .then((coinData) => {
                if (coinData == null) {
                    let coinObj = new coinModel()
                    coinObj.userId = req.body.userId
                    coinObj.taskId = req.body.taskId
                    coinObj.message = req.body.message
                    let finalCoinValue = parseInt(req.body.coinCount)
                    if (req.body.type === "Warning") {
                        finalCoinValue = -Math.abs(finalCoinValue); // ensure negative
                    } else if (req.body.type === "Reward") {
                        finalCoinValue = Math.abs(finalCoinValue);  // ensure positive
                    } else {
                        res.send({
                            status: 422,
                            success: false,
                            message: "Invalid type. Must be 'Reward' or 'Warning'."
                        });
                    }
                    coinObj.coinCount = Math.abs(parseInt(req.body.coinCount))
                    coinObj.type = req.body.type
                    coinObj.save()
                        .then((coinData) => {
                            employeeModel.findOne({ userId: coinData.userId })
                                .then((empData) => {
                                    if (empData == null) {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Employee not Found"
                                        })
                                    }
                                    else {
                                        empData.coins = (empData.coins || 0) + finalCoinValue
                                        empData.save()
                                            .then((newEmpData) => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Coin Added Successfully",
                                                    coindata: coinData,
                                                    newEmpData: newEmpData
                                                })
                                            })
                                            .catch(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Coin Not Added"
                                                })
                                            })
                                    }
                                })
                                .catch(() => {
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "Coin Not Added to Employee"
                                    })
                                })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Coin Not Added in Emp"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Coin Already Exists"
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
    coinModel.find(req.body)
        .populate("userId")
        .populate("taskId")
        .then((coinData) => {
            if (coinData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "No Coins Found"
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Coins Found",
                    data: coinData
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
        coinModel.findOne({ _id: req.body._id })
            .populate("userId")
            .populate("taskId")
            .then((coinData) => {
                if (coinData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Coin not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Coin Found",
                        data: coinData
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
        coinModel.findOne({ _id: req.body._id })
            .then((coinData) => {
                const oldCoinValue = coinData.coinCount;
                const oldType = coinData.type;
                const newCoinValue = Math.abs(parseInt(req.body.coinCount));
                const newType = req.body.type;
                if (coinData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Coin not Found"
                    })
                }
                else {
                    if (req.body.userId) {
                        coinData.userId = req.body.userId
                    }
                    if (req.body.taskId) {
                        coinData.taskId = req.body.taskId
                    }
                    if (req.body.message) {
                        coinData.message = req.body.message
                    }
                    let diff = 0;
                    // Purana effect hataao
                    if (oldType === "Reward") { diff -= oldCoinValue; }
                    if (oldType === "Warning") { diff += oldCoinValue; }
                    // Naya effect lagao
                    if (newType === "Reward") { diff += newCoinValue; }
                    if (newType === "Warning") { diff -= newCoinValue; }
                    coinData.coinCount = req.body.coinCount

                    if (req.body.type) {
                        coinData.type = req.body.type
                    }
                    coinData.save()
                        .then((coinData1) => {
                            employeeModel.findOne({ userId: coinData.userId })
                                .then((empData) => {
                                    if (empData == null) {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Employee not Found"
                                        })
                                    }
                                    else {
                                        empData.coins = (empData.coins || 0) + diff
                                        empData.save()
                                            .then((newEmpData) => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Coin Updated Successfully",
                                                    coindata: coinData1,
                                                    newEmpData: newEmpData
                                                })
                                            })
                                            .catch(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Coin Not Updated in Emp"
                                                })
                                            })
                                    }
                                })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Coin not Updated"
                            })
                        })
                }
            })
            .catch((err) => {
                console.log(err);

                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const delCoin = (req, res) => {
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
        coinModel.findOne({ _id: req.body._id })
            .then((coinData) => {
                if (coinData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Coin not Found"
                    })
                }
                else {

                    coinData.deleteOne()
                        .then(() => {
                            employeeModel.findOne({ userId: coinData.userId })
                                .then((empData) => {
                                    if (coinData.type == "Reward") {
                                        empData.coins = empData.coins - coinData.coinCount
                                    }
                                    if (coinData.type == "Warning") {
                                        empData.coins = empData.coins + coinData.coinCount
                                    }
                                    empData.save()
                                        .then((empData1) => {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Coin Deleted Successfully"
                                            })

                                        })
                                        .catch(() => {
                                            res.send({
                                                status: 200,
                                                success: false,
                                                message: "Coin Not Deleted from emp"
                                            })
                                        })
                                })
                                .catch(() => {
                                    res.send({
                                        status: 200,
                                        success: false,
                                        message: "Employee Data Not Found" 
                                    })
                                })
                            
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Coin not Deleted "
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
    if (!req.body.status) {
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
        coinModel.findOne({ _id: req.body._id })
            .then((coinData) => {
                if (coinData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Coin not Found"
                    })
                }
                else {
                    coinData.status = req.body.status
                    coinData.save()
                        .then((coinData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: coinData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 402,
                                success: false,
                                message: "Status Not Updated "
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

module.exports = { add, getAll, getSingle, update, delCoin, changeStatus }