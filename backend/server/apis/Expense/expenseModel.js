const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ticketId: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    storeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expenseHeadId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    natureOfExpense: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    amount: {
        type: DataTypes.INTEGER, // or DECIMAL/FLOAT for money
        allowNull: false
    },
    remark: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    rca: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    policy: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    policyId: {
        type: DataTypes.INTEGER
    },
    // attachment: Array of Strings in Mongoose
    attachment: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    currentApprovalLevel: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    currentStatus: {
        type: DataTypes.ENUM("Pending", "Approved", "Hold", "Rejected", "Closed"),
        defaultValue: "Pending"
    },
    raisedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    // resubmissions: Array of Objects
    resubmissions: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    holdComment: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    // holdHistory: Array of Objects
    holdHistory: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    heldFromLevel: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    postApprovalStage: {
        type: DataTypes.ENUM(
            "NONE",
            "FM_PENDING",
            "PRPO_EMAIL",
            "ZC_VERIFY",
            "CLOSED"
        ),
        defaultValue: "NONE"
    },
    wcrAttachment: { type: DataTypes.STRING, defaultValue: "" },
    invoiceAttachment: { type: DataTypes.STRING, defaultValue: "" },
    fmComment: { type: DataTypes.STRING, defaultValue: "" },
    prismId: { type: DataTypes.STRING, defaultValue: "" },
    prComment: { type: DataTypes.STRING, defaultValue: null },
    poComment: { type: DataTypes.STRING, defaultValue: null },
    prPoEmailSubject: { type: DataTypes.STRING, defaultValue: null },
    prAttachment: { type: DataTypes.STRING, defaultValue: null },
    poAttachment: { type: DataTypes.STRING, defaultValue: null },
    executionUploadedAt: { type: DataTypes.DATE },
    _id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.id;
        }
    }
}, {
    tableName: 'expenseData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = Expense;
