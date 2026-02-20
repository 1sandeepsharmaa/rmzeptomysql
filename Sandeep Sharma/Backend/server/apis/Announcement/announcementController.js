const { uploadImg } = require("../../utilities/helper")
const announcementModel = require("./announcementModel")

const add = async (req, res) => {
    var errMsgs = []
    if (!req.body.title) {
        errMsgs.push("title is required")
    }
    if (!req.body.message) {
        errMsgs.push("message is required")
    }
    if (!req.body.createdBy) {
        errMsgs.push("createdBy is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        let announcementObj = new announcementModel()
        announcementObj.title = req.body.title
        announcementObj.message = req.body.message
        announcementObj.createdBy = req.body.createdBy
        if (req.file) {
            try  {
                let url = await uploadImg(req.file.buffer)
                announcementObj.attachment = url
            }
            catch (err) {
                console.log(err);
                
                res.send({
                    status: 422,
                    success: false,
                    message: "Cloudinary Error"
                })
            }
        }
        announcementObj.save()
            .then((announcementData) => {
                res.send({
                    status: 200,
                    success: true,
                    message: "Announcement Added Successfully",
                    data: announcementData
                })
            })
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Announcement Not Added"
                })
            })
    }
}

const getAll = (req, res) => {
    announcementModel.find(req.body)
        .populate("createdBy")
        .then((announcementData) => {
            if (announcementData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "No Announcement Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Announcement Found",
                    data: announcementData
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
        announcementModel.findOne({ _id: req.body._id })
            .populate("createdBy")
            .then((announcementData) => {
                if (announcementData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Announcement not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Announcement Found",
                        data: announcementData
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
        announcementModel.findOne({ _id: req.body._id })
            .then(async (announcementData) => {
                if (announcementData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Announcement not Found"
                    })
                }
                else {
                    if (req.body.title) {
                        announcementData.title = req.body.title
                    }
                    if (req.body.message) {
                        announcementData.message = req.body.message
                    }
                    if (req.body.updatedAt) {
                        announcementData.updatedAt = req.body.updatedAt
                    }
                    if (req.file) {
                        try {
                            let url = await uploadImg(req.file.buffer)
                            announcementData.attachment = url
                        }
                        catch (err) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Cloudinary Error"
                            })
                        }
                    }

                    announcementData.save()
                        .then((announcementData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Announcement Updated Successfully",
                                data: announcementData
                            })
                        })
                        .catch((err) => {
                            console.log(err);
                            
                            res.send({
                                status: 422,
                                success: false,
                                message: "Announcement not Updated"
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
const delAnnouncement = (req, res) => {
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
        announcementModel.findOne({ _id: req.body._id })
            .then((announcementData) => {
                if (announcementData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Announcement not Found"
                    })
                }
                else {
                    announcementData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Announcement Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Announcement not Deleted "
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
        announcementModel.findOne({ _id: req.body._id })
            .then((announcementData) => {
                if (announcementData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Announcement not Found"
                    })
                }
                else {
                    announcementData.status = req.body.status
                    announcementData.save()
                        .then((announcementData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: announcementData
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

module.exports = { add, getAll, getSingle, update, delAnnouncement, changeStatus }