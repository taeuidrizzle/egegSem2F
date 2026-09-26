import { getBookById } from '../api.js';
import { addToCart, getCart } from '../state.js';

let currentBook = null;

document.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();

    // URL မှ Query Parameter (id) ကို ဖတ်ယူခြင်း (ဥပမာ- book-detail.html?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        document.getElementById('error-message').innerText = 'စာအုပ် ID မပါရှိပါ။';
        document.getElementById('loading').style.display = 'none';
        return;
    }

    await loadBookDetail(bookId);
});

function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = totalCount;
}

// API မှ စာအုပ် အချက်အလက်ယူ၍ UI ပေါ် ပြသခြင်း
async function loadBookDetail(id) {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const containerEl = document.getElementById('book-detail-container');

    try {
        const response = await getBookById(id);
        currentBook = response.data;

        if (!currentBook) {
            errorEl.innerText = 'စာအုပ် ရှာမတွေ့ပါ။';
            return;
        }

        // Data များကို UI DOM ထဲသို့ ထည့်သွင်းခြင်း
        document.getElementById('book-cover').src = currentBook.cover_image || 'https://via.placeholder.com/250';
        document.getElementById('book-title').innerText = currentBook.title;
        document.getElementById('book-author').innerText = currentBook.author || 'အမည်မသိ';
        document.getElementById('book-price').innerText = currentBook.price;
        document.getElementById('book-description').innerText = currentBook.description || 'ဖော်ပြချက် မရှိပါ။';

        containerEl.style.display = 'flex';

        // Add to cart button event
        document.getElementById('add-to-cart-detail-btn').addEventListener('click', () => {
            const qty = parseInt(document.getElementById('quantity-input').value) || 1;
            
            addToCart({
                id: currentBook.id,
                title: currentBook.title,
                price: parseFloat(currentBook.price)
            }, qty);

            updateCartCount();
            alert(`${currentBook.title} (${qty} အုပ်) ကို Cart ထဲ ထည့်ပြီးပါပြီ။`);
        });

    } catch (err) {
        errorEl.innerText = 'အချက်အလက် ခေါ်ယူ၍ မရရှိပါ: ' + err.message;
    } finally {
        loadingEl.style.display = 'none';
    }
}