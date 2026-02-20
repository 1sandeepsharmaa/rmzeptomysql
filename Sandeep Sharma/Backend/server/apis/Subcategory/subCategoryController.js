const subCategoryModel = require("./subCategoryModel")


const add = (req, res) => {
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("name is required")
    }
    if (!req.body.categoryId) {
        errMsgs.push("DepartmentId is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        subCategoryModel.findOne({ name: req.body.name })
            .then((categoryData) => {
                if (categoryData == null) {
                    let subCategoryObj = new subCategoryModel()
                    subCategoryObj.name = req.body.name
                    subCategoryObj.categoryId = req.body.categoryId
                    subCategoryObj.save()
                        .then((subCategoryData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Technology Added Successfully",
                                data: subCategoryData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Technology Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Technology Already Exists"
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
    subCategoryModel.find(req.body)
        .populate("categoryId")
        .then((subCategoryData) => {
            if (subCategoryData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Technology is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Technology Found",
                    data: subCategoryData
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
        subCategoryModel.findOne({ _id: req.body._id })
            .populate("categoryId")
            .then((subCategoryData) => {
                if (subCategoryData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Technology not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Technology Found",
                        data: subCategoryData
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
        subCategoryModel.findOne({ name: req.body.name })
            .then((subCategoryData1) => {
                if (subCategoryData1 && subCategoryData1._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Technology Already Exists with same name"
                    })
                }
                else {
                    subCategoryModel.findOne({ _id: req.body._id })
                        .then((subCategoryData) => {
                            if (subCategoryData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Technology not Found"
                                })
                            }
                            else {
                                if (req.body.name) {
                                    subCategoryData.name = req.body.name
                                }
                                if (req.body.categoryId) {
                                    subCategoryData.categoryId = req.body.categoryId
                                }
                                subCategoryData.save()
                                    .then((subCategoryData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Technology Updated Successfully",
                                            data: subCategoryData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Technology not Updated"
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
                    message: "Somehting Went Wrong"
                })
            })



    }
}

const delSubCategory = (req, res) => {
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
        subCategoryModel.findOne({ _id: req.body._id })
            .then((subCategoryData) => {
                if (subCategoryData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    subCategoryData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Data Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Data not Deleted Successfully"
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
        subCategoryModel.findOne({ _id: req.body._id })
            .then((subCategoryData) => {
                if (subCategoryData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    subCategoryData.status = req.body.status
                    subCategoryData.save()
                        .then((subCategoryData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: subCategoryData
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

module.exports = { add, getAll, getSingle, update, delSubCategory, changeStatus }