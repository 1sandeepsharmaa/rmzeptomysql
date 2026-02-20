const { uploadImg } = require("../../utilities/helper")
const taskModel = require("./taskModel")


const add = (req, res) => {
    var errMsgs = []
    if (!req.body.projectId) {
        errMsgs.push("projectId is required")
    }
    if (!req.body.employeeId) {
        errMsgs.push("employeeId is required")
    }
    if (!req.body.subCategoryId) {
        errMsgs.push("subCategoryId is required")
    }
    if (!req.body.title) {
        errMsgs.push("title is required")
    }
    if (!req.body.description) {
        errMsgs.push("description is required")
    }
    if (!req.file) {
        errMsgs.push("attachment is required")
    }
    if (!req.body.deadline) {
        errMsgs.push("deadline is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        taskModel.findOne({ title: req.body.title })
            .then(async (taskData) => {
                if (taskData == null) {
                    let taskObj = new taskModel()
                    taskObj.projectId = req.body.projectId
                    taskObj.employeeId = req.body.employeeId
                    taskObj.subCategoryId = req.body.subCategoryId
                    taskObj.title = req.body.title
                    taskObj.description = req.body.description
                    if (req.file) {
                        try {
                            let url = await uploadImg(req.file.buffer)
                            taskObj.attachment = url
                        }
                        catch (err) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Cloudinary Error"
                            })
                        }
                    }
                    taskObj.deadline = req.body.deadline
                    taskObj.save()
                        .then((taskData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Task Added Successfully",
                                data: taskData
                            })
                        })
                        .catch((err) => {
                            console.log(err);

                            res.send({
                                status: 422,
                                success: false,
                                message: "Task Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Task Already Exists"
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
    taskModel.find(req.body)
        .populate("projectId")
        .populate("employeeId")
        .populate("subCategoryId")
        .then((taskData) => {
            if (taskData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "No Task Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Tasks Found",
                    data: taskData
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
        taskModel.findOne({ _id: req.body._id })
            .populate("projectId")
            .populate("employeeId")
            .populate("subCategoryId")
            .then((taskData) => {
                if (taskData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Task not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Task Found",
                        data: taskData
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
        taskModel.findOne({ title: req.body.title })
            .then((taskData1) => {
                if (taskData1 && taskData1._id.toString() !== req.body._id.toString()) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Task Already Exists with same name"
                    })
                }
                else {
                    taskModel.findOne({ _id: req.body._id })
                        .then(async (taskData) => {
                            if (taskData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Task not Found"
                                })
                            }
                            else {
                                if (req.body.projectId) {
                                    taskData.projectId = req.body.projectId
                                }
                                if (req.body.employeeId) {
                                    taskData.employeeId = req.body.employeeId
                                }
                                if (req.body.subCategoryId) {
                                    taskData.subCategoryId = req.body.subCategoryId
                                }
                                if (req.body.title) {
                                    taskData.title = req.body.title
                                }
                                if (req.body.description) {
                                    taskData.description = req.body.description
                                }
                                if (req.file) {
                                    try {
                                        let url = await uploadImg(req.file.buffer)
                                        taskData.attachment = url
                                    }
                                    catch (err) {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Cloudinary Error"
                                        })
                                    }
                                }
                                if (req.body.deadline) {
                                    taskData.deadline = req.body.deadline
                                }
                                if (req.body.progress) {
                                    taskData.progress = req.body.progress
                                }

                                taskData.save()
                                    .then((taskData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Task Updated Successfully",
                                            data: taskData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Task not Updated"
                                        })
                                    })
                            }
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Internal Server Error"
                            })
                        })

                }
            })
            .catch((err) => {
                console.log(err);
                
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong !!"
                })
            })

    }
}

const delTask = (req, res) => {
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
        taskModel.findOne({ _id: req.body._id })
            .then((taskData) => {
                if (taskData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Task not Found"
                    })
                }
                else {
                    taskData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Task Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Task not Deleted Successfully"
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
        taskModel.findOne({ _id: req.body._id })
            .then((taskData) => {
                if (taskData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Task not Found"
                    })
                }
                else {
                    taskData.status = req.body.status
                    taskData.save()
                        .then((taskData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: taskData
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

module.exports = { add, getAll, getSingle, update, delTask, changeStatus }