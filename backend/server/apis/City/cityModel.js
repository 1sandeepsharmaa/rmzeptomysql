const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cityName: {
        type: DataTypes.JSON,
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

City.associate = (models) => {
    City.belongsTo(models.State, { foreignKey: 'stateId', as: 'stateData' });
    City.belongsTo(models.Zone, { foreignKey: 'zoneId', as: 'zoneData' });
};

module.exports = City;
