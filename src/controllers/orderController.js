const paypalService = require('../services/paypalService');

exports.createOrder = async (req, res) => {
    try {
        const accessToken = await paypalService.getAccessToken();
        const { products, total, buyer } = req.body;

        const orderData = await paypalService.createOrder(accessToken, products, total, buyer);
        res.json(orderData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.captureOrder = async (req, res) => {
    try {
        const accessToken = await paypalService.getAccessToken();
        const { orderID } = req.params;

        const captureData = await paypalService.captureOrder(accessToken, orderID);
        res.json(captureData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
