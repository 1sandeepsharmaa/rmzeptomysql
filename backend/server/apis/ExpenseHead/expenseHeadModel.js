const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ExpenseHead = sequelize.define('ExpenseHead', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    description: {
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
    tableName: 'expenseHeadData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = ExpenseHead;
