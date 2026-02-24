const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const BusinessFinance = sequelize.define('BusinessFinance', {
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
    tableName: 'businessFinanceData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = BusinessFinance;
