const storeModel = require("./storeModel");
const employeeModel = require("../Employee/employeeModel");
const userModel = require("../User/userModel");
const { Op } = require("sequelize");

// Associations are now handled centrally in model files

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.storeName) {
        errMsgs.push("storeName is required")
    }
    if (!req.body.storeCode) {
        errMsgs.push("storeCode is required")
    }
    if (!req.body.storeCategoryId) {
        errMsgs.push("storeCategoryId is required")
    }
    if (!req.body.cityName) {
        errMsgs.push("cityName is required")
    }
    if (!req.body.stateId) {
        errMsgs.push("stateId is required")
    }
    if (!req.body.zoneId) {
        errMsgs.push("zoneId is required")
    }
    if (!req.body.address) {
        errMsgs.push("address is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        storeModel.findOne({ where: { storeCode: req.body.storeCode } })
            .then((storeData) => {
                if (storeData == null) {
                    const storePayload = {
                        storeName: req.body.storeName,
                        storeCode: req.body.storeCode,
                        storeCategoryId: req.body.storeCategoryId,
                        cityName: req.body.cityName,
                        stateId: req.body.stateId,
                        zoneId: req.body.zoneId,
                        address: req.body.address
                    };

                    storeModel.create(storePayload)
                        .then((storeData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Store Added Successfully",
                                data: storeData
                            })
                        })
                        .catch((err) => {
                            console.error("Store Add Error:", err);
                            res.send({
                                status: 422,
                                success: false,
                                message: "Store Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store Already Exists"
                    })
                }
            })
            .catch((err) => {
                console.error("Store Check Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })

    }
}

const getAll = (req, res) => {
    // Whitelist allowed filter fields
    const body = req.body || {};
    const allowedFilters = {};
    if (body.storeCategoryId) allowedFilters.storeCategoryId = body.storeCategoryId;
    if (body.stateId) allowedFilters.stateId = body.stateId;
    if (body.zoneId) allowedFilters.zoneId = body.zoneId;
    if (body.cityName) allowedFilters.cityName = body.cityName;
    if (body.status !== undefined) allowedFilters.status = body.status;

    storeModel.findAll({
        where: allowedFilters,
        include: [
            { model: require("../Store Category/storeCategoryModel"), as: 'storeCategoryData' },
            { model: require("../State/stateModel"), as: 'stateData' },
            { model: require("../Zone/zoneModel"), as: 'zoneData' }
        ]
    })
        .then((storeData) => {
            if (storeData.length == 0) {
                res.send({
                    status: 200,
                    success: true,
                    message: "Store is Empty",
                    data: []
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Store Found",
                    data: storeData
                })
            }
        })
        .catch((err) => {
            console.error("GetAll Store Error:", err);
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            })
        })
}

const getSingle = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        const searchId = req.body.id || req.body._id;
        storeModel.findOne({ where: { id: searchId } })
            .then((storeData) => {
                if (storeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Store Found",
                        data: storeData.toJSON()
                    })
                }
            })
            .catch((err) => {
                console.error("GetSingle Store Error:", err);
                res.status(422).send({
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const update = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        const id = req.body.id || req.body._id;

        // Check for duplicate storeCode if it's being updated
        const checkDuplicatePromise = req.body.storeCode
            ? storeModel.findOne({ where: { storeCode: req.body.storeCode } })
            : Promise.resolve(null);

        checkDuplicatePromise
            .then((storeData1) => {
                if (storeData1 && storeData1.id.toString() !== id.toString()) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store Already Exists with same Name" // Message says Name but checks Code in original
                    })
                }
                else {
                    storeModel.findOne({ where: { id: id } })
                        .then((storeData) => {
                            if (storeData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Store not Found"
                                })
                            }
                            else {
                                if (req.body.storeName) {
                                    storeData.storeName = req.body.storeName
                                }
                                if (req.body.storeCode) {
                                    storeData.storeCode = req.body.storeCode
                                }
                                if (req.body.storeCategoryId) {
                                    storeData.storeCategoryId = req.body.storeCategoryId
                                }
                                if (req.body.cityName) {
                                    storeData.cityName = req.body.cityName
                                }
                                if (req.body.stateId) {
                                    storeData.stateId = req.body.stateId
                                }
                                if (req.body.zoneId) {
                                    storeData.zoneId = req.body.zoneId
                                }
                                if (req.body.address) {
                                    storeData.address = req.body.address
                                }
                                storeData.save()
                                    .then((storeData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Store Updated Successfully",
                                            data: storeData.toJSON()
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Store not Updated"
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

const delStore = (req, res) => {
    var errMsgs = []
    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        const id = req.body.id || req.body._id;
        storeModel.findOne({ where: { id: id } })
            .then((storeData) => {
                if (storeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store not Found"
                    })
                }
                else {
                    storeData.destroy()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Store Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Store not Deleted "
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
    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required")
    }
    if (req.body.status === undefined) {
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
        const id = req.body.id || req.body._id;
        storeModel.findOne({ where: { id: id } })
            .then((storeData) => {
                if (storeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store not Found"
                    })
                }
                else {
                    storeData.status = req.body.status
                    storeData.save()
                        .then((savedStore) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Successfully Updated",
                                data: savedStore.toJSON()
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


module.exports = { add, getAll, getSingle, update, delStore, changeStatus }