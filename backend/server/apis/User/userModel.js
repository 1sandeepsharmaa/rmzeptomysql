const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const User = sequelize.define('User', {
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
    password: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    // storeId in Mongoose was [{ type: ObjectId, ref: "storeData" }]
    // This implies a Many-To-Many relationship. 
    // In Sequelize, this is handled via associations (User.belongsToMany(Store)).
    // We do not define a column here for it.

    userType: {
        type: DataTypes.INTEGER,
        defaultValue: 0 // Changed from "" to 0 or null as it is a Number
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
    tableName: 'userData',
    timestamps: true,
    getterMethods: {
        _id() {
            return this.id;
        }
    }
});

module.exports = User;