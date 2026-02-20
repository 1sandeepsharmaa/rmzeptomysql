const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const State = sequelize.define('State', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    stateName: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    zoneId: {
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
    tableName: 'stateData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = State;
