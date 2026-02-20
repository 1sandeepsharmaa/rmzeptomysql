const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
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

// Test and Sync the connection function
const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database (MySQL) Connected Successfully.');
        await sequelize.sync({ alter: true }); // Automatically create/update tables
        console.log('Database Synced Successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        throw err;
    }
};

sequelize.syncDatabase = syncDatabase;
module.exports = sequelize;