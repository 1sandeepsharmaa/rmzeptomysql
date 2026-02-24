const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storeName: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    storeCode: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    storeCategoryId: {
        type: DataTypes.INTEGER
    },
    cityName: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    stateId: {
        type: DataTypes.INTEGER
    },
    zoneId: {
        type: DataTypes.INTEGER
    },
    address: {
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
    tableName: 'storeData',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

Store.associate = (models) => {
    Store.belongsTo(models.StoreCategory, { foreignKey: 'storeCategoryId', as: 'storeCategoryData' });
    Store.belongsTo(models.State, { foreignKey: 'stateId', as: 'stateData' });
    Store.belongsTo(models.Zone, { foreignKey: 'zoneId', as: 'zoneData' });

    // Support for legacy aliases used in adminSheetController
    Store.belongsTo(models.State, { foreignKey: 'stateId', as: 'state' });
    Store.belongsTo(models.Zone, { foreignKey: 'zoneId', as: 'zone' });
    Store.belongsTo(models.StoreCategory, { foreignKey: 'storeCategoryId', as: 'storeCategory' });
};

module.exports = Store;
