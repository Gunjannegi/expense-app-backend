const express = require('express');
const { createOrderController, verifyOrderController } = require("../controllers/paymentController.js");
const authenticate = require("../middleware/auth.js");

const router = express.Router();

router.post("/create-order", authenticate, createOrderController);
router.post("/verify", authenticate, verifyOrderController);

module.exports = router;