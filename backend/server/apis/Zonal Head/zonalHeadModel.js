const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ZonalHead = sequelize.define('ZonalHead', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    email: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    contact: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    empcode: {
        type: DataTypes.STRING,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    storeId: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    zoneId: {
        type: DataTypes.INTEGER
    },
    designation: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.id;
        }
    }
}, {
    tableName: 'zonalHeadData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = ZonalHead;
