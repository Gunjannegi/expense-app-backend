const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests', {
    id: {
        type: DataTypes.STRING,
        primaryKey:true
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    expiresAt:{
        type:DataTypes.DATE,
        allowNull:false
    }

});

module.exports =  ForgotPasswordRequests;