const Sequelize = require('sequelize');

const sequelize = new Sequelize('WanderLust', 'postgres', 'Mast3rGandal1f', {
    host: 'localhost',
    dialect: 'postgres'
});

//create combined postgres/Heroku server

module.exports = sequelize;