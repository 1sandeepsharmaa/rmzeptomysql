const projectTeamModel = require("./projectTeamModel")


const add = (req, res) => {
    var errMsgs = []
    if (!req.body.projectId) {
        errMsgs.push("projectId is required")
    }
    if (!req.body.employeeId) {
        errMsgs.push("employeeId is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        projectTeamModel.findOne({ projectId: req.body.projectId })
            .then((projectTeamData) => {
                if (projectTeamData == null) {
                    let projectTeamObj = new projectTeamModel()
                    projectTeamObj.projectId = req.body.projectId
                    projectTeamObj.employeeId = req.body.employeeId
                    projectTeamObj.save()
                        .then((projectTeamData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Employee Added Successfully in Team",
                                data: projectTeamData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Employee Not Added in Team"
                            })
                        })
                }
                else {
                    let existsEmployees = projectTeamData.employeeId.map(id => id.toString());
                    let newIds = req.body.employeeId.filter(id => !existsEmployees.includes(id));
                    if (newIds.length == 0) {
                        res.send({
                            status: 422,
                            success: false,
                            message: "Employee Already Exists in Team"
                        })
                    }
                    else {
                        projectTeamData.employeeId.push(...newIds)
                        projectTeamData.save()
                            .then((updatedData) => {
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "New Employee Added in Team",
                                    data: updatedData
                                })
                            })
                            .catch(() => {
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "New Employee Not Added in Team"
                                })
                            })
                    }
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
    projectTeamModel.find(req.body)
        .populate("projectId")
        .populate("employeeId")
        .then((projectTeamData) => {
            if (projectTeamData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "No Project Team Found"
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Project Team Found",
                    data: projectTeamData
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
        projectTeamModel.findOne({ _id: req.body._id })
            .populate("projectId")
            .populate("employeeId")
            .then((projectTeamData) => {
                if (projectTeamData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Project Team not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Project Team Found",
                        data: projectTeamData
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
        projectTeamModel.findOne({ _id: req.body._id })
            .then((projectTeamData) => {
                if (projectTeamData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Project not Found"
                    })
                }
                else {
                    if (req.body.projectId) {
                        projectTeamData.projectId = req.body.projectId
                    }
                    if (req.body.employeeId) {
                        if (Array.isArray(req.body.employeeId)) {
                            projectTeamData.employeeId = req.body.employeeId
                        }
                        else {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Employee must be in array"
                            })
                        }
                    }
                    projectTeamData.save()
                        .then((projectTeamData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Project Team Updated Successfully",
                                data: projectTeamData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Project Team not Updated"
                            })
                        })
                }
            })
            .catch((err) => {
                console.log("Error is",err);
                
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const delProject = (req, res) => {
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
        projectTeamModel.findOne({ _id: req.body._id })
            .then((projectTeamData) => {
                if (projectTeamData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Project Team not Found"
                    })
                }
                else {
                    projectTeamData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Project Team Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Project Team not Deleted "
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
        projectTeamModel.findOne({ _id: req.body._id })
            .then((projectTeamData) => {
                if (projectTeamData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Project Team not Found"
                    })
                }
                else {
                    projectTeamData.status = req.body.status
                    projectTeamData.save()
                        .then((projectTeamData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: projectTeamData
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

module.exports = { add, getAll, getSingle, update, delProject, changeStatus }