const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storeName: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    storeCode: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    storeCategoryId: {
        type: DataTypes.INTEGER
    },
    cityName: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    stateId: {
        type: DataTypes.INTEGER
    },
    zoneId: {
        type: DataTypes.INTEGER
    },
    address: {
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
    tableName: 'storeData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = Store;
