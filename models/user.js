const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');
const ForgotPasswordRequests = require('./forgotPasswordRequests');

const User = sequelize.define('User', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   username: {
      type: DataTypes.STRING,
      allowNull: false
   },
   userphone: {
      type: DataTypes.STRING,
      allowNull: false
   },
   useremail: {
      type: DataTypes.STRING,
      allowNull: false
   },
   userpassword: {
      type: DataTypes.STRING,
      allowNull: false
   },
   isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
   },
   totalExpense: {
      type: DataTypes.INTEGER,
      defaultValue: 0
   }

});

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

module.exports = User;