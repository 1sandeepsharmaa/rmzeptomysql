const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Employee = sequelize.define('Employee', {
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
    storeId: {
        type: DataTypes.INTEGER
        // This attempts to replicate the single ObjectId ref. 
        // Association will be defined effectively as Employee.belongsTo(Store)
    },
    userId: {
        type: DataTypes.INTEGER, // Changed from String to Integer assuming User ID is now Integer
        defaultValue: null
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
    tableName: 'employee',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = Employee;
