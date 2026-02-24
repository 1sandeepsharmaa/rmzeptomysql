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
        type: DataTypes.JSON,
        defaultValue: []
    },
    userId: {
        type: DataTypes.INTEGER,
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

Employee.associate = (models) => {
    Employee.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    // Note: storeId is a JSON array, so a direct belongsTo won't work for joins,
    // but the association might be used for other purposes.
    Employee.belongsTo(models.Store, { foreignKey: 'storeId', as: 'store' });
};

module.exports = Employee;
