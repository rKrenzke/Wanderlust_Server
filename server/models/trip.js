module.exports = function(sequelize, DataTypes){
    return sequelize.define('trip', {
        location: DataTypes.STRING,
        description: DataTypes.STRING,
        sites: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        rating: DataTypes.INTEGER
    });
};