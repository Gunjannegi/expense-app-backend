const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.RDS_ENDPOINT,  // ✅ Fixed!
    dialect: 'mysql',
    port: process.env.DB_PORT
});

sequelize.authenticate().then(()=>{
    console.log("Connection has been established.")
}).catch(err=>{console.log(err)});

module.exports = sequelize;