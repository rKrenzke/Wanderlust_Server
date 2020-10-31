const Sequelize = require('sequelize');

const { DB_NAME, DB_PASS, DB_USER } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: 'localhost',
    dialect: 'postgres'
});

//create combined postgres/Heroku server

module.exports = sequelize;