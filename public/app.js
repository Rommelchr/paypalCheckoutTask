document.addEventListener("DOMContentLoaded", function () {
    const products = document.querySelectorAll('.product');
    const productList = [];

    products.forEach(product => {
        const name = product.querySelector('h2').innerText.split(': ')[1];
        const sku = product.getAttribute('data-sku');
        const price = parseFloat(product.getAttribute('data-price'));

        productList.push({
            name: name,
            item_number: sku,
            price: price
        });
    });

    function validateForm() {
        const requiredFields = document.querySelectorAll('#buyer-form input[required]');
        let valid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                valid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        const errorMessage = document.getElementById('error-message');
        if (!valid) {
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
        }

        return valid;
    }

    document.querySelectorAll('#buyer-form input').forEach(input => {
        input.addEventListener('input', validateForm);
    });

    paypal.Buttons({
        createOrder: function (data, actions) {
            if (!validateForm()) {
                document.getElementById('error-message').scrollIntoView({ behavior: 'smooth' });
                return actions.reject();
            }
            const totalAmount = productList.reduce((total, product) => total + product.price, 0).toFixed(2);
            return fetch('/api/orders', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    products: productList,
                    total: totalAmount,
                    buyer: {
                        first_name: document.querySelector('input[name="first_name"]').value,
                        last_name: document.querySelector('input[name="last_name"]').value,
                        email: document.querySelector('input[name="email"]').value,
                        phone: document.querySelector('input[name="phone"]').value,
                        address1: document.querySelector('input[name="address1"]').value,
                        address2: document.querySelector('input[name="address2"]').value,
                        state: document.querySelector('input[name="state"]').value,
                        zip: document.querySelector('input[name="zip"]').value,
                        country: document.querySelector('input[name="country"]').value
                    }
                })
            }).then(function (res) {
                return res.json();
            }).then(function (orderData) {
                return orderData.id;
            });
        },
        onApprove: function (data, actions) {
            return fetch(`/api/orders/${data.orderID}/capture`, {
                method: 'post'
            }).then(function (res) {
                return res.json();
            }).then(function (orderData) {
                document.body.innerHTML = `
                    <h1>Thank you for your purchase!</h1>
                    <p>Transaction ID: ${orderData.id}</p>
                    <a href="main.html">Return to Main Page</a>
                `;
            });
        },
        onError: function (err) {
            console.error('PayPal button error:', err);
        }
    }).render('#paypal-button-container');
});
