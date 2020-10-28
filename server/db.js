const Sequelize = require('sequelize');

const sequelize = new Sequelize('WanderLust', 'postgres', 'passwordhere', {
    host: '',
    dialect: 'postgres'
});

module.exports = sequelize;