const submitModel = require("./submitModel")
const { uploadImg } = require("../../utilities/helper")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.taskId) {
        errMsgs.push("taskId is required")
    }
    if (!req.file) {
        errMsgs.push("file is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        submitModel.findOne({ taskId: req.body.taskId })
            .then(async (submitData) => {
                if (submitData == null) {
                    let submitObj = new submitModel()
                    submitObj.taskId = req.body.taskId
                    if (req.file) {
                        try {
                            let url = await uploadImg(req.file.buffer)
                            submitObj.file = url
                        }
                        catch (err) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Cloudinary Error"
                            })
                        }
                    }

                    submitObj.save()
                        .then((submitData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Task Submit Successfully",
                                data: submitData
                            })
                        })
                        .catch((err) => {
                            console.log("Error is",err)
                            res.send({
                                status: 422,
                                success: false,
                                message: "Internal Server Error"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "This Task is already Submitted"
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
    submitModel.find(req.body)
        .populate("taskId")
        .then((submitData) => {
             if (submitData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "No Submitted Task",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Submitted Tasks Found",
                    data: submitData
                })

            }
        })
        .catch(() => {
            res.send({
                status: 402,
                success: false,
                message: "Submitted Data Not Found",
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
        submitModel.findOne({ _id: req.body._id })
            .then((submitData) => {
                if (submitData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Submitted Task not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Submitted Task Found",
                        data: submitData
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
        submitModel.findOne({ _id: req.body._id })
            .then(async (submitData) => {
                if (submitData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Submitted Task not Found"
                    })
                }
                else {
                    if (req.body.taskId) {
                        submitData.taskId = req.body.taskId
                    }
                    if (req.file) {
                        try {
                            let url = await uploadImg(req.file.buffer)
                            submitData.file = url
                        }
                        catch (err) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Cloudinary Error"
                            })
                        }
                    }
                    submitData.save()
                        .then((submitData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Submitted Data Updated Successfully",
                                data: submitData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Submitted Data not Updated"
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

const delSubmit = (req, res) => {
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
        submitModel.findOne({ _id: req.body._id })
            .then((submitData) => {
                if (submitData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Submitted Task not Found"
                    })
                }
                else {
                    submitData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Submitted Task Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Submitted Task not Deleted "
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
        submitModel.findOne({ _id: req.body._id })
            .then((submitData) => {
                if (submitData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Submitted Task not Found"
                    })
                }
                else {
                    submitData.status = req.body.status
                    submitData.save()
                        .then((submitData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: submitData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
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

module.exports = { add, getAll, getSingle, update, delSubmit, changeStatus }