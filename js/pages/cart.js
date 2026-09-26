import { createOrder, uploadPaymentSlip } from '../api.js';
import { getCart, removeFromCart, clearCart, addToCart } from '../state.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    // Checkout Form Submit Event
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
});

// Cart Items များကို UI DOM ပေါ် ရေးဆွဲခြင်း
function renderCart() {
    const cart = getCart();
    const tbody = document.getElementById('cart-items-body');
    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cart ထဲတွင် စာအုပ်များ မရှိသေးပါ။</td></tr>';
        totalEl.innerText = '0';
        document.getElementById('submit-order-btn').disabled = true;
        return;
    }

    document.getElementById('submit-order-btn').disabled = false;
    let grandTotal = 0;

    tbody.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        return `
            <tr>
                <td>${item.title}</td>
                <td>${item.price} MMK</td>
                <td>
                    <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                    ${item.quantity}
                    <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
                </td>
                <td>${itemTotal} MMK</td>
                <td>
                    <button class="remove-btn" data-id="${item.id}">ဖျက်မည်</button>
                </td>
            </tr>
        `;
    }).join('');

    totalEl.innerText = grandTotal;

    // Quantity Increase/Decrease & Remove Events တပ်ဆင်ခြင်း
    attachCartEvents();
}

function attachCartEvents() {
    // Quantity + / - Event
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const action = e.target.dataset.action;
            const cart = getCart();
            const item = cart.find(i => i.id == id);

            if (item) {
                if (action === 'increase') {
                    addToCart(item, 1);
                } else if (action === 'decrease' && item.quantity > 1) {
                    addToCart(item, -1);
                }
                renderCart();
            }
        });
    });

    // Remove Item Event
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            removeFromCart(id);
            renderCart();
        });
    });
}

// Order တင်ခြင်းနှင့် Payment Slip Upload တင်ခြင်း Flow
async function handleCheckout(e) {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
        alert('Cart ထဲတွင် စာအုပ်များ မရှိသေးပါ။');
        return;
    }

    const submitBtn = document.getElementById('submit-order-btn');
    const errorEl = document.getElementById('error-message');
    errorEl.innerText = '';

    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('shipping-address').value;
    const fileInput = document.getElementById('payment-slip');

    if (fileInput.files.length === 0) {
        alert('Payment Slip ပုံ တင်ပေးပါ။');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Order တင်နေပါသည်...';

        // 1. Order Data API ပို့ခြင်း
        const orderPayload = {
            customer_name: name,
            phone: phone,
            shipping_address: address,
            items: cart.map(item => ({
                book_id: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        const orderResponse = await createOrder(orderPayload);
        const orderId = orderResponse.data.order_id; // Backend မှ ပြန်ပေးလိုက်သော Order ID

        // 2. Payment Slip Image Upload တင်ခြင်း
        const formData = new FormData();
        formData.append('order_id', orderId);
        formData.append('payment_slip', fileInput.files[0]);

        await uploadPaymentSlip(formData);

        // 3. အောင်မြင်ပါက Cart ရှင်းထုတ်ပြီး ရလဒ်ပြခြင်း
        clearCart();
        alert('Order တင်ခြင်း အောင်မြင်ပါသည်။ Order ID: ' + orderId);
        window.location.href = 'catalog.html';

    } catch (err) {
        errorEl.innerText = 'Order တင်၍ မရရှိပါ: ' + err.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Order တင်မည်';
    }
}