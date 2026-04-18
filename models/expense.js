const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");
const User = require("./user");

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note:{
      type:DataTypes.STRING,
      allowNull:false
    }
  }
);

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = Expense;
