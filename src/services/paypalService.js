const fetch = require('node-fetch');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

async function getAccessToken() {
    const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
        method: 'post',
        body: 'grant_type=client_credentials',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const data = await response.json();
    return data.access_token;
}

async function createOrder(accessToken, products, total, buyer) {
    const response = await fetch('https://api.sandbox.paypal.com/v2/checkout/orders', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: total
                }
            }],
            payer: {
                name: {
                    given_name: buyer.first_name,
                    surname: buyer.last_name
                },
                email_address: buyer.email,
                phone: {
                    phone_number: {
                        national_number: buyer.phone
                    }
                },
                address: {
                    address_line_1: buyer.address1,
                    address_line_2: buyer.address2,
                    admin_area_1: buyer.state,
                    postal_code: buyer.zip,
                    country_code: buyer.country
                }
            }
        })
    });
    return response.json();
}

async function captureOrder(accessToken, orderID) {
    const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return response.json();
}

module.exports = {
    getAccessToken,
    createOrder,
    captureOrder
};
