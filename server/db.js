
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

//create combined postgres/Heroku server

module.exports = sequelize;