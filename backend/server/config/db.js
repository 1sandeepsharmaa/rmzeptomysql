const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'client_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false
    }
);

const models = {};

// Function to initialize all models and associations
const initModels = () => {
    const apisDir = path.join(__dirname, '../apis');

    // Recursive function to find and require all models
    const findModels = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                findModels(fullPath);
            } else if (file.endsWith('Model.js')) {
                const model = require(fullPath);
                if (model.name) {
                    models[model.name] = model;
                }
            }
        }
    };

    if (fs.existsSync(apisDir)) {
        findModels(apisDir);
    }

    // Call associate if it exists
    Object.values(models).forEach(model => {
        if (model.associate) {
            model.associate(models);
        }
    });
};

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database (MySQL) Connected Successfully.');

        // Initialize models and associations before sync
        initModels();

        await sequelize.sync();
        console.log('Database Synced Successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        throw err;
    }
};

sequelize.syncDatabase = syncDatabase;
sequelize.initModels = initModels;
sequelize.models = models;

module.exports = sequelize;