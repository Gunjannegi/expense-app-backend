const express = require('express');
const { forgotPassword, resetpassword, updatePassword } = require('../controllers/passwordController');
const router = express.Router();

router.post('/forgotpassword', forgotPassword);
router.get('/resetpassword/:requestId',resetpassword);
router.post('/resetpassword/:requestId',updatePassword);

module.exports = router;