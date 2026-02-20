const categoryModel = require("./categoryModel")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("name is required")
    }
    if (!req.body.description) {
        errMsgs.push("description is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        categoryModel.findOne({ name: req.body.name })
            .then((categoryData) => {
                if (categoryData == null) {
                    let catObj = new categoryModel()
                    catObj.name = req.body.name
                    catObj.description = req.body.description
                    catObj.save()
                        .then((categoryData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Department Added Successfully",
                                data: categoryData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Department Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Department Already Exists"
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
    categoryModel.find(req.body)
        .then((categoryData) => {
            if (categoryData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Department is Empty",
                    data: categoryData
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Department Found",
                    data: categoryData
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
        categoryModel.findOne({ _id: req.body._id })
            .then((categoryData) => {
                if (categoryData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Department not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Department Found",
                        data: categoryData
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
        categoryModel.findOne({ name: req.body.name })
            .then((categoryData1) => {
                if (categoryData1 && categoryData1._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Department Already Exists with same Name"
                    })
                }
                else {
                    categoryModel.findOne({ _id: req.body._id })
                        .then((categoryData) => {
                            if (categoryData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Category not Found"
                                })
                            }
                            else {
                                if (req.body.name) {
                                    categoryData.name = req.body.name
                                }
                                if (req.body.description) {
                                    categoryData.description = req.body.description
                                }
                                categoryData.save()
                                    .then((categoryData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Category Updated Successfully",
                                            data: categoryData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Category not Updated"
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

const delCategory = (req, res) => {
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
        categoryModel.findOne({ _id: req.body._id })
            .then((categoryData) => {
                if (categoryData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Department not Found"
                    })
                }
                else {
                    categoryData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Department Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Department not Deleted "
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
        categoryModel.findOne({ _id: req.body._id })
            .then((categoryData) => {
                if (categoryData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Department not Found"
                    })
                }
                else {
                    categoryData.status = req.body.status
                    categoryData.save()
                        .then((categoryData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: categoryData
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


module.exports = { add, getAll, getSingle, update, delCategory, changeStatus }