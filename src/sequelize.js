const Sequelize = require('sequelize');
const config = require('./mysql.config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,
  host: config.host,
  port: config.port,
  timestamps: false,
  timezone: '+08:00',
  pool: {
    max: 5,
    idle: 10000,
    acquire: 10000
  }
});

module.exports = sequelize;