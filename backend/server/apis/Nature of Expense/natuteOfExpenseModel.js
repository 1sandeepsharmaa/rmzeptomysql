const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const NatureOfExpense = sequelize.define('NatureOfExpense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    expenseHeadId: {
        type: DataTypes.INTEGER
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
    tableName: 'natureOfExpenseData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = NatureOfExpense;