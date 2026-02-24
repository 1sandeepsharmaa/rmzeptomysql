const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ExpenseApproval = sequelize.define('ExpenseApproval', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    expenseId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false
    },
    approverId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM("Approved", "Rejected", "Hold", "Closed", "Resubmitted"),
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    actionAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.id;
        }
    }
}, {
    tableName: 'expenseApprovalData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ExpenseApproval.associate = (models) => {
    ExpenseApproval.belongsTo(models.Expense, { foreignKey: 'expenseId', as: 'expense' });
    ExpenseApproval.belongsTo(models.User, { foreignKey: 'approverId', as: 'approver' });
};

module.exports = ExpenseApproval;
