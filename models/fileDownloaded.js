const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');
const User = require('./user');

const FileDownloaded = sequelize.define('FileDownloaded',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    url:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

User.hasMany(FileDownloaded);
FileDownloaded.belongsTo(User);


module.exports = FileDownloaded;