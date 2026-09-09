const express = require('express');
const { createOrder, verifyPayment, getRazorpayKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/key', protect, getRazorpayKey);
router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;

