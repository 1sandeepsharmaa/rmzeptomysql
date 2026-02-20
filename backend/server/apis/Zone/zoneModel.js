const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Zone = sequelize.define('Zone', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    zoneName: {
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
    tableName: 'zoneData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = Zone;