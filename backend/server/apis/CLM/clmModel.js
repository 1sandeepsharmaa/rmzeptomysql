const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CLM = sequelize.define('CLM', {
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
    // storeId was [{ type: ObjectId, ref: "storeData" }]
    // This implies Many-To-Many. Handled via associations.

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
    tableName: 'CLMData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = CLM;
