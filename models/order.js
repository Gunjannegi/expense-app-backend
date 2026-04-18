const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");
const User = require("./user");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING"  // PENDING | SUCCESS | FAILED
  }
});

User.hasMany(Order);
Order.belongsTo(User);

module.exports = Order;
