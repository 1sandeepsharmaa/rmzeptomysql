const projectModel = require("./projectModel")
const { uploadImg } = require("../../utilities/helper")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("name is required")
    }
    if (!req.body.description) {
        errMsgs.push("description is required")
    }
    if (!req.file) {
        errMsgs.push("attachment is required")
    }
    if (!req.body.client) {
        errMsgs.push("client is required")
    }
    if (!req.body.subCategoryId) {
        errMsgs.push("subCategoryId is required")
    }
    if (!req.body.categoryId) {
        errMsgs.push("categoryId is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        projectModel.findOne({ name: req.body.name })
            .then(async (projectData) => {
                if (projectData == null) {
                    let projectObj = new projectModel()
                    projectObj.name = req.body.name
                    projectObj.description = req.body.description
                    if (req.file) {
                        try {
                            let url = await uploadImg(req.file.buffer)
                            projectObj.attachment = url
                        }
                        catch (err) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Cloudinary Error"
                            })
                        }
                    }
                    projectObj.client = req.body.client
                    projectObj.categoryId = req.body.categoryId
                    projectObj.subCategoryId = req.body.subCategoryId
                    projectObj.save()
                        .then((projectData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Project Added Successfully",
                                data: projectData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Project Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Proejct Already Exists"
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

const getAll = (req, res) => {
    projectModel.find(req.body)
        .populate("categoryId")
        .populate("subCategoryId")
        .then((projectData) => {
            if (projectData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "No Project Found"
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Project Found",
                    data: projectData
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
        projectModel.findOne({ _id: req.body._id })
            .populate("categoryId")
            .populate("subCategoryId")
            .then((projectData) => {
                if (projectData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Project not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Project Found",
                        data: projectData
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
        projectModel.findOne({ name: req.body.name })
            .then((projectData1) => {
                if (projectData1 && projectData1._id.toString() !== req.body._id.toString()) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Project Already Exists with same name"
                    })
                }
                else {
                    projectModel.findOne({ _id: req.body._id })
                        .then(async (projectData) => {
                            if (projectData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Project not Found"
                                })
                            }
                            else {
                                if (req.body.name) {
                                    projectData.name = req.body.name
                                }
                                if (req.body.description) {
                                    projectData.description = req.body.description
                                }
                                if (req.file) {
                                    try {
                                        let url = await uploadImg(req.file.buffer)
                                        projectData.attachment = url
                                    }
                                    catch (err) {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Cloudinary Error"
                                        })
                                    }
                                }
                                if (req.body.client) {
                                    projectData.client = req.body.client
                                }
                                if (req.body.categoryId) {
                                    projectData.categoryId = req.body.categoryId
                                }
                                if (req.body.subCategoryId) {
                                    projectData.subCategoryId = req.body.subCategoryId
                                }
                                projectData.save()
                                    .then((projectData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Project Updated Successfully",
                                            data: projectData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Project not Updated"
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
            .catch(() => {
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
        projectModel.findOne({ _id: req.body._id })
            .then((projectData) => {
                if (projectData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Project not Found"
                    })
                }
                else {
                    projectData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Project Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Project not Deleted Successfully"
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
        projectModel.findOne({ _id: req.body._id })
            .then((projectData) => {
                if (projectData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Project not Found"
                    })
                }
                else {
                    projectData.status = req.body.status
                    projectData.save()
                        .then((projectData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: projectData
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