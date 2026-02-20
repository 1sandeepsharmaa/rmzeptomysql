const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cityName: {
        type: DataTypes.JSON, // Mongoose schema had [{type:String}], implying multiple names or an array
        defaultValue: []
    },
    stateId: {
        type: DataTypes.INTEGER
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
    tableName: 'cityData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = City;
