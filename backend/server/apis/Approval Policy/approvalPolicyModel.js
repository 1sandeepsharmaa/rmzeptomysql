const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ApprovalPolicy = sequelize.define('ApprovalPolicy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  minAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  approvalLevels: {
    type: DataTypes.JSON, // Storing array of strings as JSON
    allowNull: false
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
  tableName: 'approvalPolicyData',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = ApprovalPolicy;