const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.post('/orders', orderController.createOrder);
router.post('/orders/:orderID/capture', orderController.captureOrder);

module.exports = router;
