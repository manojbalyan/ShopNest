const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

const addOrderItems = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      userId: req.user._id,
      items: items.map(item => ({
        productId: item.productId,
        qty: item.qty,
        price: item.price
      })),
      totalAmount,
      address,
      paymentId: paymentId || 'PENDING'
    });

    const createdOrder = await order.save();

    // Decrement inventory stock for each purchased product
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -Number(item.qty || 1) }
        });
      }
    }

    // Send Order Confirmation Email
    const message = `
      <h2>Order Confirmation</h2>
      <p>Hello ${req.user.name},</p>
      <p>Your order has been successfully placed! Order ID: <strong>${createdOrder._id}</strong></p>
      <p>Total Amount Paid: ₹${Number(totalAmount).toFixed(2)}</p>
      <p>Payment Reference: <strong>${paymentId || 'N/A'}</strong></p>
      <p>It will be shipped to: ${address.street}, ${address.city}, ${address.country}</p>
      <p>Thank you for shopping with ShopNest!</p>
    `;

    await sendEmail({
      email: req.user.email,
      subject: 'ShopNest - Order Confirmation',
      message
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'name imageUrl price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.productId', 'name imageUrl price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
