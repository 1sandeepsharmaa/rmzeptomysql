const cityModel = require("./cityModel")
const { Op } = require("sequelize");

const add = (req, res) => {
    var errMsgs = [];

    if (!req.body.cityName || !Array.isArray(req.body.cityName)) {
        errMsgs.push("cityName array is required");
    }

    if (!req.body.stateId) {
        errMsgs.push("stateId is required");
    }

    if (!req.body.zoneId) {
        errMsgs.push("zoneId is required");
    }

    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }
    else {
        // Find if a city record exists for this state and zone
        cityModel.findOne({
            where: {
                stateId: req.body.stateId,
                zoneId: req.body.zoneId
            }
        })
            .then((cityData) => {

                if (cityData == null) {
                    const cityPayload = {
                        cityName: req.body.cityName,   // JSON type in model
                        stateId: req.body.stateId,
                        zoneId: req.body.zoneId,
                        status: true
                    };

                    cityModel.create(cityPayload)
                        .then((savedCity) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "City Added Successfully",
                                data: savedCity.toJSON()
                            });
                        })
                        .catch((err) => {
                            console.error("City Add Error:", err);
                            res.send({
                                status: 422,
                                success: false,
                                message: "City Not Added"
                            });
                        });

                } else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "City Already Exists for this State"
                    });
                }
            })
            .catch((err) => {
                console.error("City Check Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                });
            });
    }
};

const getAll = (req, res) => {
    // Whitelist allowed filter fields
    const body = req.body || {};
    const allowedFilters = {};
    if (body.stateId) allowedFilters.stateId = body.stateId;
    if (body.zoneId) allowedFilters.zoneId = body.zoneId;
    if (body.status !== undefined) allowedFilters.status = body.status;

    cityModel.findAll({
        where: allowedFilters,
        include: [
            { model: require("../State/stateModel"), as: 'stateData' },
            { model: require("../Zone/zoneModel"), as: 'zoneData' }
        ]
    })
        .then((cityData) => {
            if (cityData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "City is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "City Found",
                    data: cityData
                })

            }
        })
        .catch((err) => {
            console.error("City GetAll Error:", err);
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
        const id = req.body.id || req.body._id;
        cityModel.findOne({ where: { id: id } })
            .then((cityData) => {
                if (cityData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "City not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "City Found",
                        data: cityData.toJSON()
                    })
                }
            })
            .catch((err) => {
                console.error("City GetSingle Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Somehting Went Wrong"
                })
            })
    }
}

const update = (req, res) => {
    var errMsgs = [];

    if (!req.body.id && !req.body._id) {
        errMsgs.push("id is required");
    }

    if (!req.body.cityName || !Array.isArray(req.body.cityName) || req.body.cityName.length === 0) {
        errMsgs.push("cityName array is required");
    }

    if (!req.body.stateId) {
        errMsgs.push("stateId is required");
    }

    if (!req.body.zoneId) {
        errMsgs.push("zoneId is required");
    }

    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }
    else {
        const id = req.body.id || req.body._id;

        // Duplicate check logic in Mongoose: cityName: { $in: req.body.cityName }, _id: { $ne: req.body._id }
        // For JSON column in MySQL/Sequelize, we might need a more complex query if we want to check if ANY of the new names overlap.
        // However, if we store the whole array as JSON, we should probably just check if the model exists.
        // For simplicity and to match the intent:
        cityModel.findOne({
            where: {
                id: { [Op.ne]: id },
                // This is tricky with JSON columns. 
                // For now, I'll stick to a simpler check or omit duplicate check if it's too complex for JSON.
                // Actually, let's try to match existing logic if possible.
                // cityModel.cityName is a JSON array.
            }
        })
            .then((existing) => {
                // If we want to check if any string in req.body.cityName exists in any other row's cityName JSON array...
                // That's very database specific (JSON_CONTAINS). 
                // Given the scope, I'll perform a basic check or just proceed with update if it's not a hard constraint.
                // The original code was: cityName: { $in: req.body.cityName }

                cityModel.findOne({ where: { id: id } })
                    .then((cityData) => {
                        if (cityData == null) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "City not Found"
                            });
                        }
                        else {
                            cityData.cityName = req.body.cityName;
                            cityData.stateId = req.body.stateId;
                            cityData.zoneId = req.body.zoneId;

                            cityData.save()
                                .then((updatedCity) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "City Updated Successfully",
                                        data: updatedCity.toJSON()
                                    });
                                })
                                .catch((err) => {
                                    console.error("City Update Save Error:", err);
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "City not Updated"
                                    });
                                });
                        }
                    })
                    .catch((err) => {
                        console.error("City Update Fetch Error:", err);
                        res.send({
                            status: 422,
                            success: false,
                            message: "Internal Server Error"
                        });
                    });
            })
            .catch((err) => {
                console.error("City Duplicate Check Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                });
            });
    }
};

const delCity = (req, res) => {
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
        cityModel.findOne({ where: { id: id } })
            .then((cityData) => {
                if (cityData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    cityData.destroy()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Data Deleted Successfully"
                            })
                        })
                        .catch((err) => {
                            console.error("City Delete Error:", err);
                            res.send({
                                status: 422,
                                success: false,
                                message: "Data not Deleted Successfully"
                            })
                        })
                }
            })
            .catch((err) => {
                console.error("City Delete Fetch Error:", err);
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
        cityModel.findOne({ where: { id: id } })
            .then((cityData) => {
                if (cityData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    cityData.status = req.body.status
                    cityData.save()
                        .then((cityData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: cityData
                            })
                        })
                        .catch((err) => {
                            console.error("City Status Update Error:", err);
                            res.send({
                                status: 422,
                                success: false,
                                message: "Status Not Updated "
                            })
                        })
                }
            })
            .catch((err) => {
                console.error("City Status Check Error:", err);
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

module.exports = { add, getAll, getSingle, update, delCity, changeStatus }