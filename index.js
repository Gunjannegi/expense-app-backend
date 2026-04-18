const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const aiRoutes = require('./routes/aiRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const exportRoutes = require('./routes/exportRoutes');
const sequelize = require('./utils/db-connection');
require("./models/user");
require("./models/expense");
require("./models/fileDownloaded")
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined',{stream:accessLogStream}));
app.use('/user', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/payment', paymentRoutes);
app.use('/premium', premiumRoutes);
app.use('/ask', aiRoutes);
app.use('/password', passwordRoutes);
app.use('/exports',exportRoutes);
app.get('/test', (req, res) => {
    res.send('Backend live test')
})

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running...");
  });
}).catch((err) => { console.log(err) });
